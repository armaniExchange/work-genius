// Libraries
import express from 'express';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';
import { CronJob } from 'cron';
import jwt from 'jsonwebtoken';
// GraphQL and schema
import schema from './schema/schema.js';
import { loginHandler } from './models/User/UserMutation.js';
// Crawler
import { crawlGK2 } from './crawler/crawler.js';
// Constants
import {
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

app.post('/login', loginHandler);

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
// new CronJob('30 */10 * * * *', () => {
// 	crawlGK2();
// }, null, true);

app.use('/graphql', graphqlHTTP(request => ({
    schema: schema,
    rootValue: { req: request },
    pretty: true,
    graphiql: true
})));

app.listen(PORT, () => {
	console.log(`Server is listening at port: ${PORT}`);
});
