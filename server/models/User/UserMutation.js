// GraphQL
import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

// Active Directory
import ActiveDirectory from 'activedirectory';
// Models
import UserType from './UserType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT, LDAP, LDAP_AUTH_PREFIX } from '../../constants/configurations.js';

function adPromise(account, password) {
    return new Promise((resolve, reject) => {
 		// try to login
		let	ad = new ActiveDirectory(LDAP);
		ad.authenticate(account, password, function(err, auth) {
			if (err || !auth) {
                reject(new Error('No content!!'));
            } else {
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
		type: UserType,
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
			// console.log('before auth session id', root.request);
			console.log('before auth session id', session.uid);
			if (!(account.includes('@') || account.includes('\\'))) {
				account = LDAP_AUTH_PREFIX + account;
			}
		    try {    		    	
		        let authenticated = await adPromise(account, password);

				try {
					let connection = await r.connect({ host: DB_HOST, port: DB_PORT });					
					r.db('work_genius').table('users').insert({
						user_id: account
						// password: password
					}).run(connection);
					//console.log(mutationResult);
					// record session
					if (authenticated) {
						session.uid = account;						
					} else {
						console.log('Auth failed');
					}
				} catch (e) {
					console.log('connect to rethinkdb error:', e);
				}

		        return authenticated;
		    } catch (e) {
		        console.log('connect to ldap error or rethinkdb error:', e);
		    }			
		}
	}
};

export default UserMutation;
