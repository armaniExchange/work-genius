// GraphQL
import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';
// Libraries
import ActiveDirectory from 'activedirectory';
import jwt from 'jsonwebtoken';
// Constants
import {
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

function extractUserInformation() {
	let user = {};
	user.name = 'Test';
	user.email = 'test@test.com';
	user.birthday = Math.random() * 100;
	return user;
}

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
		resolve: async (root, { account, /*password*/ }) => {
			let session = root;
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
		        // let auth = await adPromise(account, password);
				session.user = extractUserInformation();
		        return token;
		    } catch (err) {
		        return err;
		    }
		}
	},
	'userLogout': {
		type: GraphQLString,
		description: 'Logout User',
		resolve: async (root) => {
			let session = root;
		    session.destroy((err) => {
		    	return err;
		    });
		    return 'Log out successfully';
		}
	}
};

export default UserMutation;
