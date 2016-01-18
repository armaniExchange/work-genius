// Libraries
import express from 'express';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';
import { CronJob } from 'cron';
import ActiveDirectory from 'activedirectory';
import jwt from 'jsonwebtoken';
// GraphQL and schema
import schema from './schema/schema.js';
// Crawler
import { crawlGK2 } from './crawler/crawler.js';
// Constants
import {
    LDAP,
    LDAP_AUTH_PREFIX,
    SECURE_KEY
} from './constants/configurations.js';

const PORT = 3000;
let app = express();

app.use(bodyParser.text({
	type: 'application/graphql'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE');
	next();
});

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.send();
    } else {
        next();
    }
});



app.post('/login', async (req, res) => {
    let adPromise = (account, password) => {
        return new Promise((resolve, reject) => {
            // try to login
            let ad = new ActiveDirectory(LDAP);
            ad.authenticate(account, password, (err, auth) => {
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
    let { account, password } = req.body;
    let user = {
        name: 'Howard Chang',
        nickname: 'Howard C',
        email: 'howardc@a10networks.com',
        birthday: Math.random() * 100
    };
    let admin = {
        name: 'Admin',
        nickname: 'Admin',
        email: 'admin@a10networks.com',
        birthday: Math.random() * 100
    };
    if (account === 'admin') {
        user = admin;
    }
    if (!(account.includes('@') || account.includes('\\'))) {
        account = LDAP_AUTH_PREFIX + account;
    }
    try {
        // let auth = await adPromise(account, password);
        let token = jwt.sign(user, SECURE_KEY, {
            expiresIn: '30 days'
        });
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
});

app.use((req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECURE_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                req.token = token;
                next();
            }
        });
    } else {
        res.status(401).send({
            success: false,
            message: 'No token provided'
        });
    }
});

// Crawling GK2 every 10 minutes
new CronJob('30 */10 * * * *', () => {
	crawlGK2();
}, null, true);

app.use('/graphql', graphqlHTTP(request => ({
    schema: schema,
    rootValue: { req: request },
    pretty: true,
    graphiql: true
})));

app.listen(PORT, () => {
	console.log(`Server is listening at port: ${PORT}`);
});
