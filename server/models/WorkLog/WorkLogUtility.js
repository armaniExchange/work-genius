// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import moment from 'moment';

// create a worklog
export async function createWorkLog(worklog){
	let connection = null,
		query = null;

	try {
		if(!('create_date' in worklog)){
			worklog.create_date = Number.parseFloat(moment().format('x'));
		}
		worklog.update_date = worklog.create_date;
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
};

//update a worklog
export async function updateWorkLog(id, worklog){
	let connection = null,
		query = null;

	try {
		
		if(worklog.id){
			delete worklog.id;
		}
		worklog.update_date = Number.parseFloat(moment().format('x'));
		query = r.db('work_genius').table('worklog').get(id).update(worklog);
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		await query.run(connection);
		await connection.close();
	} catch (err) {
		return 'Fail to update a worklog!';
	}
	return 'Update worklog successfully!';
}