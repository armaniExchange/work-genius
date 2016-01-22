// GraphQL
import {
	GraphQLString,
	GraphQLList
} from 'graphql';
// Models
import PTOType from './PTOType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let TaskQuery = {
	'ptoApplications': {
		type: new GraphQLList(PTOType),
		description: 'Get all tasks from GK2',
		args: {
			applicantId: {
				type: GraphQLString,
				description: 'The applicant id for filtering applications'
			}
		},
		resolve: async (root, { applicantId }) => {
			let connection = null,
				filterCondition = !applicantId ? {} : {
					'applicant_id': applicantId
				},
			    result = null,
				query = r.db('work_genius').table('pto')
				    .filter(filterCondition)
				    .coerceTo('array');

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default TaskQuery;
