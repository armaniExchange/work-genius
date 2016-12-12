// Libraries
import ActiveDirectory from 'activedirectory';
import crypto from 'crypto';
import { Record } from 'immutable';
import jwt from 'jsonwebtoken';
// GraphQL
import {
  GraphQLString
} from 'graphql';

// RethinkDB
import r from 'rethinkdb';
// Constants
import {
    LDAP,
    LDAP_AUTH_PREFIX,
    SECURE_KEY,
    DB_HOST,
    DB_PORT
} from '../../constants/configurations.js';

const HASH_LEVEL = 'sha512';
// const DB_NAME = 'test';
const DB_NAME = 'work_genius';

let User = Record({
    'id': '',
    'name': '',
    'nickname': '',
    'email': '',
    'title': '',
    'privilege': '',
    'username': ''
});

let authenticateByLdapPromise = function(ad, user, password) {
    return new Promise((resolve, reject) => {
        ad.authenticate(user, password, function(err, auth) {

            if (err) {
                reject(new Error(err));
            }

            if (auth) {
                resolve(auth);
            } else {
                console.log('authenticateByLdapPromise');
                console.log(err);
                reject(new Error(err));
            }

        });
    });

};

let findUserByDBPromise = function(username, password) {
    return new Promise((resolve, reject) => {
        let pwd = crypto.createHash(HASH_LEVEL).update(password).digest('base64');
        let connection = r.connect({ host: DB_HOST, port: DB_PORT });
        let query = r.db(DB_NAME).table('users').filter({'username': username, 'password': pwd});

        connection.then((conn) => {
            query.run(conn, (error, cursor) => {
                if (error) throw error;

                cursor.next(async (err, result) => {
                    if (err) {

                        if (((err.name === 'ReqlDriverError') && err.message === 'No more rows in the cursor.')) {
                            reject('Your username or password is wrong.');
                        } else {
                            reject(err);
                        }

                    } else {
                        resolve(new User(result));

                    }
                });
            });
        });
    });
};

let findUserByLdapPromise = function(ad, username) {
    return new Promise((resolve, reject) => {
        let query = {
            filter: '(sAMAccountName=' + username + ')',
            attributes: ['displayName', 'mail', 'title', 'sAMAccountName', 'uSNCreated', 'givenName']
        };

        ad.findUser(query, username, function(err, results) {
            if (err) {
                reject(new Error(JSON.stringify(err)));
            }

            if (results) {

                let user = new User({
                    'id': results['uSNCreated'],
                    'name': results['displayName'],
                    'nickname': results['givenName'],
                    'email': results['mail'],
                    'title': results['title'],
                    'privilege': getPrivilege(results['sAMAccountName']),
                    'username': results['sAMAccountName']
                });

                resolve(user);
            }
        });
    });

};

let loginPromise = function(username, password) {
  let user = 'corp\\' + username;
  let config = JSON.parse(JSON.stringify(LDAP));
  let ad;

  config['username'] = user;
  config['password'] = password;

  ad = new ActiveDirectory(config);

  return new Promise((resolve, reject) => {
    authenticateByLdapPromise(ad, user, password)
      .then(function(auth) {
        return findUserByLdapPromise(ad, username);
      }, function(err) {
        return findUserByDBPromise(username, password);
      })
      .then(function(user) {
        resolve(user);
      }, function(err) {
        reject(err);
      });
  });
};


let getPrivilege = function(username) {
    let privilege = 0;

    switch(username) {
        case 'zli':
        case 'stsai':
        case 'chuang':
        case 'kjia':
            privilege = 10;
            break;
        default:
            privilege = 5;
    }

    return privilege;
};

let UserMutation = {
    'updateUserPrivilege': {
        type: GraphQLString,
        description: 'Set user privilege',
        args: {
            id: {
                type: GraphQLString,
                description: 'User\'s id'
            },
            privilege: {
                type: GraphQLString,
                description: 'User\'s privilege'
            }
        },
        resolve: async (root, { id, privilege }) => {
            let connection = null,
                mutationQuery = null;
            try {
                connection = await r.connect({ host: DB_HOST, port: DB_PORT });
                mutationQuery = r.db(DB_NAME).table('users').get(id).update({privilege});
                await mutationQuery.run(connection);
                await connection.close();
            } catch (err) {
                return err;
            }

            return 'Update successfully!';
        }
    },
};

export const loginHandler = async (req, res) => {
    let { account, password } = req.body;

    try {

        let user = await loginPromise(account, password);

        user = user.toJS();

        let token = jwt.sign(user, SECURE_KEY, {
            expiresIn: '30 days'
        });

        let connection = null,
            result = null,
            query = null;

        connection = r.connect({ host: DB_HOST, port: DB_PORT });
        query = r.db(DB_NAME).table('users').filter({'email': user['email']});

        connection.then((conn) => {
            query.run(conn, (err, cursor) => {
                if (err) throw err;

                let fetchNext = async (err, result) => {

                    user['password'] = crypto.createHash(HASH_LEVEL).update(password).digest('base64');

                    if (err) {

                        if (((err.name === 'ReqlDriverError') && err.message === 'No more rows in the cursor.')) {

                            query = r.db(DB_NAME).table('users').insert(user);
                            query.run(conn, () => {
                                conn.close();
                            });

                        } else {
                            throw err;
                        }

                    } else {

                        delete user['id'];
                        query = r.db(DB_NAME).table('users').filter({'email': user['email']}).update(user);
                        query.run(conn, () => {
                            conn.close();
                        });

                    }

                };

                cursor.next(fetchNext);
            });
        });


        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        query = r.db(DB_NAME).table('users').filter({'email': user['email']}).coerceTo('array');
        result = await query.run(connection);

        res.json({
            success: true,
            token: token,
            user: result[0]
        });

    } catch (err) {
        console.log('**********error from loginHandler start**********');
        console.log(err);
        console.log('**********error from loginHandler end**********');
        res.status(401).send({
            success: false,
            message: 'Unauthorized: ' + JSON.stringify(err)
        });
    }
};

export default UserMutation;
