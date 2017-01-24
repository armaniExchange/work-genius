// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let RCABugMutation = {
	'updateRCABugCount': {
		type: GraphQLString,
		description: 'update rca bug count',
        args: {
			data: {
				type: GraphQLString,
				description: 'new bug data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				let rcaBug = JSON.parse(data);
				console.log("rcaBug:", rcaBug);
				console.log();
				if(!("employee_id" in rcaBug) || !("year" in rcaBug)){
					return 'Fail to update rca bug count!';
				}

				query = r.db('work_genius').table('rca_bugs')
						 .filter({"employee_id" : rcaBug.employee_id, "year" : rcaBug.year}).update(rcaBug);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return 'Fail to update rca bug count!';
			}
			return 'Update rca bug count successfully!';
		}
	}

};

export default RCABugMutation;