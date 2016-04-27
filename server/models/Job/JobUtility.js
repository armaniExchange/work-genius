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
import moment from 'moment';

//create a job
export async function createJob(job){
	let connection = null,
		query = null;

	try {
		
		job.end_date = await getJobEndDate(job);

		query = r.db('work_genius').table('jobs').insert(job);
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		let result = await query.run(connection);
		await connection.close();
		let id = '';
	    if (result && result.generated_keys && result.generated_keys.length > 0){
	      id = result.generated_keys[0];
	    }
	    return id;
	} catch (err) {
		console.log(err);
		return 'Fail to create a job!';
	}
};

//update a job 
export async function updateJob(id,job){
	let connection = null,
		query = null;

	try {
		if(job.id){
			delete job.id;
		}
		if(job.duration){
			job.end_date = await getJobEndDate(job);
		}

		query = r.db('work_genius').table('jobs').get(id).update(job);
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		await query.run(connection);
		await connection.close();
	} catch (err) {
		return 'Fail to update a job!';
	}
	return 'Update job successfully!';
}