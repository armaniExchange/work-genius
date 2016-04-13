// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let WorkLogMutation = {
	'createWorkLog': {
		type: GraphQLString,
		description: 'create a worklog ',
        args: {
			data: {
				type: GraphQLString,
				description: 'new worklog data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				
				let worklog = JSON.parse(data);
				if(!Number.isInteger(worklog.date)){
					return 'Fail to create a worklog!';
				}

				query = r.db('work_genius').table('worklog').insert(worklog);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let result = await query.run(connection);
				await connection.close();

				let id = '';
		        if (result && result.generated_keys && result.generated_keys.length > 0){
		          id = result.generated_keys[0];
		        }
		        return id;
			} catch (err) {
				return 'Fail to create a worklog!';
			}
		}
	},
	'updateWorkLog': {
		type: GraphQLString,
		description: 'update a worklog ',
        args: {
        	id: {
				type: GraphQLID,
				description: 'worklog id'
        	},
			data: {
				type: GraphQLString,
				description: 'new worklog data'
			}
		},
		resolve: async (root, { id,data }) => {
			let connection = null,
				query = null;

			try {
				
				let worklog = JSON.parse(data);
				if(!(worklog.employee_id && worklog.date && Number.isInteger(worklog.date))){
					return 'Fail to update a worklog!';
				}
				if(worklog.id){
					delete worklog.id;
				}
				query = r.db('work_genius').table('worklog').get(id).update(worklog);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return 'Fail to update a worklog!';
			}
			return 'Update worklog successfully!';
		}
	}

};

export default WorkLogMutation;