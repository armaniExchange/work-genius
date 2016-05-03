// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import { createWorkLog , updateWorkLog} from './WorkLogUtility.js';

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
			try{
				let worklog = JSON.parse(data);
				return await createWorkLog(worklog);
			}catch(err){
				console.log(err);
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
			try{
				let worklog = JSON.parse(data);
				return await updateWorkLog(id,worklog);
			}catch(err){
				console.log(err);
				return 'Fail to update a worklog!';
			}
		
		}
	},
	'deleteWorkLog': {
		type: GraphQLString,
		description: 'delete a worklog ',
        args: {
        	id: {
				type: GraphQLID,
				description: 'worklog id'
        	}
		},
		resolve: async (root, { id }) => {
			let connection = null,
				query = null;

			try {
				
				query = r.db('work_genius').table('worklog').get(id).delete();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return 'Fail to delete a worklog!';
			}
			return 'Delete worklog successfully!';
		}
	}

};

export default WorkLogMutation;