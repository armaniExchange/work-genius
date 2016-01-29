// Libraries
import ActiveDirectory from 'activedirectory';
import jwt from 'jsonwebtoken';
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

let UserMutation = {};

const fakeExtract = function(account) {
	switch (account) {
		case 'howardc':
			return {
				id: '00001',
				name: 'Howard Chang',
				nickname: 'Howard C.',
				email: 'howardc@a10networks.com'
			};
		case 'vlai':
			return {
				id: '00002',
				name: 'Vans Lai',
				nickname: 'Chia Wei L.',
				email: 'vlai@a10networks.com'
			};
		case 'ahuang':
			return {
				id: '00003',
				name: 'Albert Huang',
				nickname: 'Albert H.',
				email: 'ahuang@a10networks.com'
			};
		case 'stsai':
			return {
				id: '00004',
				name: 'Roll Tsai',
				nickname: 'Roll T.',
				email: 'stsai@a10networks.com'
			};
		case 'shuang':
			return {
				id: '00005',
				name: 'Shih-Ming Huang',
				nickname: 'Shih-Ming H.',
				email: 'shuang@a10networks.com'
			};
		case 'sho':
			return {
				id: '00006',
				name: 'Shau-Hua Ho',
				nickname: 'Shau-Hua H.',
				email: 'sho@a10networks.com'
			};
		case 'kfong':
			return {
				id: '00007',
				name: 'Kuang-Hui Fong',
				nickname: 'Kuang-Hui F.',
				email: 'kfong@a10networks.com'
			};
		case 'zli':
			return {
				id: '00008',
				name: 'Zuoping Li',
				nickname: 'Zuoping L.',
				email: 'zli@a10networks.com'
			};
		case 'admin':
			return {
				id: '00000',
				name: '',
				nickname: '',
				email: '',
				privilege: 10
			};
		default:
			return {
				id: '99999',
				name: 'Tester',
				nickname: 'Tester',
				email: 'tester@a10networks.com'
			};
	}
};

export const loginHandler = async (req, res) => {
	let { account, password } = req.body;

	// if (!(account.includes('@') || account.includes('\\'))) {
 //        account = LDAP_AUTH_PREFIX + account;
 //    }
	try {
        // let auth = await adPromise(account, password);
        let user = fakeExtract(account);
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
