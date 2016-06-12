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
				let job = { ...obj};
				if('content' in job){
					delete job.content;
				}
				if('tags' in job){
					delete job.tags;
				}
				job.create_time = Number.parseFloat(moment().format('x'));
				job.update_time = job.create_time;
				let id = await createJob(job);
		        if (id && !id.includes('Fail')){
		          //create related worklog
		          if(obj.content || obj.tags){
		          	let worklog = {
		          		content : obj.content || '',
		          		author_id : obj.employee_id,
		          		create_date : moment().format('x'),
		          		job_id : id,
		          		tags : obj.tags || []
		          	}
		          	await createWorkLog(worklog);
		          }
		        }
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
				let job = {...obj};
				if('content' in job){
					delete job.content;
				}
				if('tags' in job){
					delete job.tags;
				}
				job.update_time = Number.parseFloat(moment().format('x'));
				await updateJob(id, job); 
				
				//update related worklog
				if(obj.content || obj.tags){
					connection = await r.connect({ host: DB_HOST, port: DB_PORT });
					query = r.db('work_genius').table('worklog').filter({job_id:id}).coerceTo('array');
					// the related worklog exists, we need to update it
					let worklogList = await query.run(connection);
					if(worklogList && worklogList.length > 0){
						let worklog = {
			          		content : obj.content || worklogList[0].content,
			          		author_id : worklogList[0].author_id,
			          		update_date : moment().format('x'),
			          		tags : obj.tags || worklogList[0].tags
			          	}
			          	await updateWorkLog(worklogList[0].id,worklog);
					}else{
						// the related worklog doesn't exist, we need to create it
						let worklog = {
			          		content : obj.content || '',
			          		author_id : obj.employee_id,
			          		create_date : moment().format('x'),
			          		job_id : id,
			          		tags : obj.tags || []
			          	}
			          	await createWorkLog(worklog);
					}
				}
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

				//delete the related worklog
				query = r.db('work_genius').table('worklog').filter({job_id:id}).delete();
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