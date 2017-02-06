// GraphQL
import {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';
// Models
import RCA_BUG_TYPE from './RCABugType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let RCABugQuery = {
	'getRCABugCount': {
		type: new GraphQLList(RCA_BUG_TYPE),
		description: 'Get RCA bug count',
        args: {
			year: {
				type: GraphQLInt,
				description: 'year'
			}
		},
		resolve: async (root, { year }) => {
			let connection = null,
			    result = null,
				query = null;

			try {

				if(year){
					query = r.db('work_genius').table('rca_bugs').filter({"year": year}).coerceTo('array');
				} else{
					query = r.db('work_genius').table('rca_bugs').coerceTo('array');
				}
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = query.run(connection);
				
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default RCABugQuery;