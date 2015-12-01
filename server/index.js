// Express
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import RDBStore from 'session-rethinkdb';

// GraphQL and schema
import { graphql } from 'graphql';
import schema from './schema/schema.js';
import { DB_HOST, DB_PORT, SECURE_KEY } from './constants/configurations.js';

// Crawler
import { crawlGK2 } from './crawler/crawler.js';

const PORT = 3000;
let app = express();

app.use(bodyParser.text({
	type: 'application/graphql'
}));

app.use((req, res, next) => {
	// console.log(req.headers.origin);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
	next();
});


// for express-session settings
const OPTIONS = {
    servers: [
        {host: DB_HOST, port: DB_PORT}
    ],
    // cleanupInterval: 5000, // optional, default is 60000 (60 seconds)
    table: 'sessions' // optional, default is 'session'
};

const STORE = new RDBStore(session)(OPTIONS);
// console.log(store);
app.use(session({
    secret: SECURE_KEY,
    key: 'sid',
    store: STORE,
    cookie: { secure: 'auto' }
}));

crawlGK2();

app.post('/graphql', (req, res) => {
	let rootValue = {request:req, response:res};
	// console.log(req);
	graphql(schema, req.body, rootValue).then((result) => {
		res.send(JSON.stringify(result, null, 4));
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening at port: ${PORT}`);
});
