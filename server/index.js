// Express
import express from 'express';
import bodyParser from 'body-parser';

// GraphQL and schema
import { graphql } from 'graphql';
import schema from './schema/schema.js';

// Sequelize
import Sequelize from 'sequelize';

// Constants
import { CONNECTION_STRING } from './constants/configurations.js';

const PORT = 3000;
let app = express();
let sequelize = new Sequelize(CONNECTION_STRING);

app.use(bodyParser.text({
	type: 'application/graphql'
}));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

sequelize.sync().then(() => {
	app.post('/graphql', (req, res) => {
		graphql(schema, req.body).then((result) => {
			res.send(JSON.stringify(result, null, 4));
		});
	});
	app.listen(PORT, () => {
		console.log(`Server is listening at port: ${PORT}`);
	});
}, () => {
	console.log('Failing to connect to database');
});
