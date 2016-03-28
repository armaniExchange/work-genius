// GraphQL
import {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';
// Models
import BUG_TYPE from './BugType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugQuery = {
	'getAllBugs': {
		type: new GraphQLList(BUG_TYPE),
		description: 'Get all bugs',
        args: {
			label: {
				type: GraphQLString,
				description: 'project'
			},
			assignedTo: {
				type: GraphQLString,
				description: 'assigned To'
			},
			pageSize: {
				type: GraphQLInt,
				description: 'page size'
			},
			pageIndex: {
				type: GraphQLInt,
				description: 'page index'
			}
		},
		resolve: async (root, { label, assignedTo, pageSize, pageIndex }) => {
			let connection = null,
			    result = null,
                filter = {},
				query = null;

			try {
				console.log('label:' + label);
				console.log('assignedTo:' + assignedTo);
				console.log('page size:' + pageSize);
				console.log('page index:' + pageIndex);
				if(label){
					filter.label = label;
				}
				if(assignedTo){
					filter.assigned_to = assignedTo;
				}
				query = r.db('work_genius').table('bugs').filter(filter).skip((pageIndex - 1) * pageSize).limit(pageSize).coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection); 
				console.log('result:');
				console.log(result);             
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default BugQuery;