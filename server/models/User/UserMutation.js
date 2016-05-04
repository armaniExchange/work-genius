// Libraries
import ActiveDirectory from 'activedirectory';
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

let loginPromise = function(username, password) {

    let user = 'corp\\' + username;
    let config = JSON.parse(JSON.stringify(LDAP));
    let ad;

    config['username'] = user;
    config['password'] = password;

    ad = new ActiveDirectory(config);

    return new Promise((resolve, reject) => {
        authenticatePromise(ad, user, password)
            .then(function(auth) {
                return findUserPromise(ad, username);
            }, function(err) {
                console.log('login fail');
                reject(err);
            })
            .then(function(user) {
                resolve(user);
            }, function(err) {
                console.log('find user fail');
                reject(err);
            });
    });


};

let authenticatePromise = function(ad, user, password) {

    return new Promise((resolve, reject) => {
        ad.authenticate(user, password, function(err, auth) {

            if (err) {
                reject(new Error(JSON.stringify(err)));
            }

            if (auth) {
                resolve(auth);
            } else {
                reject(new Error(JSON.stringify(err)));
            }

        });
    });

};

let findUserPromise = function(ad, username) {

    return new Promise((resolve, reject) => {
        let query = {
            filter: '(sAMAccountName=' + username + ')',
            attributes: ['displayName', 'mail', 'title', 'sAMAccountName', 'givenName']
        };

        ad.findUser(query, username, function(err, results) {
            if (err) {
                reject(new Error(JSON.stringify(err)));
            }

            if (results) {
                resolve(results);
            }
        });
    });

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
                mutationQuery = r.db('work_genius').table('users').get(id).update({privilege});
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
        let loginInfo = await loginPromise(account, password);
        let privilege = 0;

        switch(loginInfo['sAMAccountName']) {
            case 'zli':
            case 'stsai':
                privilege = 10;
                break;
            default:
                privilege = 5;
        }

        let user = {
            id: loginInfo['mail'],
            name: loginInfo['displayName'],
            nickname: loginInfo['givenName'],
            email: loginInfo['mail'],
            title: loginInfo['title'],
            privilege: privilege
        };

        let token = jwt.sign(user, SECURE_KEY, {
            expiresIn: '30 days'
        });

        let connection = null,
            result = null,
            query = null;

        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        query = r.db('work_genius').table('users').get(user.id);
        result = await query.run(connection);

        if (!result) {
            query = r.db('work_genius').table('users').insert(user);
        } else {
            query = r.db('work_genius').table('users').get(user.id).update(user);
        }

        result = await query.run(connection);

        await connection.close();

        res.json({
            success: true,
            token: token,
            user: user
        });
        
    } catch (err) {
        res.status(401).send({
            success: false,
            message: 'Not authorized'
        });
    }
};


export default UserMutation;
