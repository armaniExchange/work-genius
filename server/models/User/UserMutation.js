// GraphQL
import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';
// Libraries
import ActiveDirectory from 'activedirectory';
import jwt from 'jsonwebtoken';
import r from 'rethinkdb';
// Constants
import {
	DB_HOST,
	DB_PORT,
	LDAP,
	LDAP_AUTH_PREFIX,
	SECURE_KEY
} from '../../constants/configurations.js';

function adPromise(account, password) {
    return new Promise((resolve, reject) => {
 		// try to login
		let	ad = new ActiveDirectory(LDAP);
		ad.authenticate(account, password, function(err, auth) {
			if (err || !auth) {
				console.log('Login Failed');
                reject(new Error('Account or Password Incorrect!'));
            } else {
            	console.log('Login successfully');
                resolve(auth);
            }
		});
    });
};

/*
// query example
mutation RootMutationType {
    login(account:"zli", password:"xxxxxx") {
        title
    }
}
*/

let UserMutation = {
	'userLogin': {
		type: GraphQLString,
		description: 'Login User',
		args: {
			account: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'Login account'
			},
			password: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'Login password'
			}
		},
		resolve: async (root, { account, password }) => {
			let session = root.request.session;
			let token = jwt.sign({
				account: account,
				isLoggedIn: true
			}, SECURE_KEY, {
				expiresIn: '30 days'
			});

			if (!(account.includes('@') || account.includes('\\'))) {
				account = LDAP_AUTH_PREFIX + account;
			}
		    try {
		        let auth = await adPromise(account, password);
		        if (auth) {
			        let connection = await r.connect({ host: DB_HOST, port: DB_PORT });
			        let insertion = r.db('work_genius').table('users').insert({
							id: account
						}, {
							conflict: 'update'
						});

					await insertion.run(connection);
					session.token = token;
			        return token;
		    	} else {
					token = jwt.sign({
						account: account,
						isLoggedIn: false
					}, SECURE_KEY, {
						expiresIn: '30 days'
					});		    		
		    	}
		    } catch (err) {
		        return err;
		    }
		}
	},
	'userLogout': {
		type: GraphQLString,
		description: 'Logout User',
		resolve: async (root) => {
			let session = root.request.session;
		    session.destroy((err) => {
		    	return err;
		    });
		    return 'Log out successfully';
		}
	}
};

export default UserMutation;
