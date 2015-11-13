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
		// let auth = await ad.authenticate(account, password);
		// console.log(ad);
		if (!(account.includes('@') || account.includes('\\'))) {
			account = LDAP_AUTH_PREFIX + account;
		}    

		ad.authenticate(account, password, function(err, auth) {
			if (err || !auth) {
                reject(new Error('No content!!'));
            } else {
                resolve(auth);
            }
		});

    });
};


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
			console.log(session.uid);
			// console.log(root);
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
					session.uid = account;
				} catch (e) {
					console.log(e);
				}

		        return authenticated;
		    } catch (e) {
		        console.log(e);
		    }
			// // try to login
			// let	ad = new ActiveDirectory(LDAP);
			// // let auth = await ad.authenticate(account, password);
			// // console.log(ad);
			// if (!(account.includes('@') || account.includes('\\'))) {
			// 	account = LDAP_AUTH_PREFIX + account;
			// } 

			// ad.authenticate(account, password, async function(err, auth) {
			// 	console.log(auth, 'test');
			// 	if (err) {
			// 		console.log('ERROR: '+JSON.stringify(err));
			// 		return;
			// 	}
				
			// 	if (auth) {
			// 		// console.log('222');
			// 		try {
			// 			let connection = await r.connect({ host: DB_HOST, port: DB_PORT });					
			// 			let mutationResult = r.db('work_genius').table('users').insert({
			// 				username: account,
			// 				password: password
			// 			}).run(connection);
			// 			console.log(mutationResult);
			// 		} catch (e) {
			// 			console.log(e);
			// 		}
			// 		// 	query = r.db('work_genius').table('users')
			// 		// 	    .filter({username: account}).coerceTo('array');

			// 		// try {
						
			// 		// 	connection = await r.connect({ host: DB_HOST, port: DB_PORT });
			// 		// 	mutationResult = await mutationQuery.run(connection);
			// 		// 	console.log('333');
			// 		// 	if (mutationResult.skipped) {
			// 		// 		throw new Error('User not Found!');
			// 		// 	} else if (mutationResult.errors) {
			// 		// 		throw new Error(mutationResult.first_error);
			// 		// 	}
			// 		// 	console.log('444');
			// 		// 	let queryResult = await query.run(connection);
			// 		// 	console.log(queryResult);
			// 		// 	await connection.close();						
			// 		// 	console.log('555');
			// 		// } catch (e) {
			// 		// 	console.log(e, 'test');
			// 		// 	return e;
			// 		// } 
			// 		console.log('Authentication successed!');
			// 	} else {
			// 		console.log('Authentication failed!');
			// 	}				
				
			// });
			// console.log('333');
		}
	}
};

export default UserMutation;
