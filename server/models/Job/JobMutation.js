// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import { getJobEndDate } from './JobCalc.js';
import { createWorkLog, updateWorkLog } from '../WorkLog/WorkLogUtility.js';
import { createJob , updateJob } from './JobUtility.js';
import moment from 'moment';

let JobMutation = {
	'createJobAndWorkLog': {
		type: GraphQLString,
		description: 'create a job and create a worklog if need',
        args: {
			data: {
				type: GraphQLString,
				description: 'new job data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				
				let obj = JSON.parse(data);
				obj.create_time = Number.parseFloat(moment().format('x'));
				obj.update_time = obj.create_time;
				let id = await createJob(obj);
		        return id;
			} catch (err) {
				console.log(err);
				return 'Fail to create a job!';
			}
		}
	},
	'updateJobAndWorkLog': {
		type: GraphQLString,
		description: 'update a job and related worklog if need',
        args: {
        	id: {
				type: GraphQLID,
				description: 'job id'
        	},
			data: {
				type: GraphQLString,
				description: 'new job data'
			}
		},
		resolve: async (root, { id,data }) => {
			let connection = null,
				query = null;

			try {
				
				let obj = JSON.parse(data);
				obj.update_time = Number.parseFloat(moment().format('x'));
				await updateJob(id, obj); 
				await connection.close();
			} catch (err) {
				return 'Fail to update a job!';
			}
			return 'Update job successfully!';
		}
	},
	'deleteJob': {
		type: GraphQLString,
		description: 'delete a job ',
        args: {
        	id: {
				type: GraphQLID,
				description: 'job id'
        	}
		},
		resolve: async (root, { id }) => {
			let connection = null,
				query = null;

			try {
				
				query = r.db('work_genius').table('jobs').get(id).delete();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);

				await connection.close();
			} catch (err) {
				return 'Fail to delete a job!';
			}
			return 'Delete job successfully!';
		}
	}

};

export default JobMutation;