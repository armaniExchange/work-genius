// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import { APPROVED, CANCEL_REQUEST_APPROVED, CANCEL_REQUEST_PENDING } from '../../../src/constants/pto-constants';

export async function createPTO(data){
	let connection = null,
		mutationQuery = null,
		finalData = JSON.parse(data);
	try {
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		mutationQuery = r.db('work_genius').table('overtime_summary').get(finalData.applicant_id);
		let overtimeSummary = await mutationQuery.run(connection);
		let hours = !overtimeSummary ? 0 : overtimeSummary.hours;
		mutationQuery = r.db('work_genius').table('pto').insert({
			...finalData,
			work_day_hours: hours - finalData.hours < 0 ? -(hours - finalData.hours) : 0
		});
		await mutationQuery.run(connection);
		await connection.close();
	} catch (err) {
		return err;
	}

	return 'Create successfully!';
};

export async function updatePTOStatus(id, status, hours){
	let connection = null,
		mutationQuery = null,
		result, userId;
	try {
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		mutationQuery = r.db('work_genius').table('pto').get(id).update({
			status: status,
			isCompensable: r.row('isCompensable').default(false).or(status === CANCEL_REQUEST_PENDING && r.row('status').eq(APPROVED))
		}, {
			returnChanges: true
		});
		result = await mutationQuery.run(connection);
		if (status === APPROVED) {
			userId = result.changes[0].new_val.applicant_id;
			mutationQuery = r.db('work_genius').table('overtime_summary').get(userId);
			result = await mutationQuery.run(connection);
			if (!result) {
				mutationQuery = r.db('work_genius').table('overtime_summary').insert({
					id: userId,
					hours: 0
				});
			} else {
				let leftoverHours = result.hours - hours;
				if (leftoverHours >= 0) {
					mutationQuery = r.db('work_genius').table('overtime_summary').get(userId).update({
						hours: leftoverHours
					});
				} else {
					mutationQuery = r.db('work_genius').table('pto').get(id).update({
						hoursToDeduct: -leftoverHours
					});
					await mutationQuery.run(connection);
					mutationQuery = r.db('work_genius').table('overtime_summary').get(userId).update({
						hours: 0
					});
				}
			}
			await mutationQuery.run(connection);
		} else if (status === CANCEL_REQUEST_APPROVED && result.changes[0].new_val.isCompensable) {
			let hoursToDeduct = result.changes[0].new_val.hoursToDeduct || 0;
			userId = result.changes[0].new_val.applicant_id;
			mutationQuery = r.db('work_genius').table('overtime_summary').get(userId).update({
			    hours: r.row('hours').add(hours).sub(hoursToDeduct).default(0)
			});
			await mutationQuery.run(connection);
		}
		await connection.close();
	} catch (err) {
		return err;
	}

	return 'Update successfully!';
}
