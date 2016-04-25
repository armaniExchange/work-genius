// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import moment from 'moment';

//calc the end date of worklog
//we need to jump over the weekend/public holiday/pto
export async function getWorklogEndDate(worklog){
	let endDate = 0 ,
		query = null,
		connection = null;
	try{
		//add default value
		endDate = worklog.start_date;
		if(worklog.duration <= 8){
			endDate = worklog.start_date + worklog.duration * 1000 * 60 * 60;
		}
		else{
			connection = await r.connect({ host: DB_HOST, port: DB_PORT });

			//get pto list
			query = r.db('work_genius').table('pto')
				.filter({applicant_id:worklog.employee_id})
				.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
				.filter(r.row('hours').coerceTo('number').ge(8))
				.pluck('start_date','end_date','hours').coerceTo('array');
			let ptoList = await query.run(connection);

			//get public holiday list
			query = r.db('work_genius').table('users')
				.get(worklog.employee_id).pluck('id','location');
			let user = await query.run(connection);
			let location = user.location;
			query = r.db('work_genius').table('holiday').filter({'location':location})
				.filter(r.row('date').ge(worklog.start_date))
				.pluck('date','type').coerceTo('array');
			let holidayList = await query.run(connection);

			let duration = worklog.duration - 8,
				tmpDate = worklog.start_date;
			//calc the end date
			while(duration >0 ){
				tmpDate = tmpDate + 1000 * 60 *60 * 24;
				let findPto = ptoList.find(pto => {
					if(moment(pto.start_date).isSame(moment(pto.end_date))){
						return moment(tmpDate).isSame(pto.start_date,'day');
					}else{
						return moment(tmpDate).isBetween(pto.start_date,pto.end_date)
							|| moment(tmpDate).isSame(pto.start_date,'day')
							|| moment(tmpDate).isSame(pto.end_date,'day');
					}
				});
				// check if public holiday
				let findHoliday = holidayList.find( holiday => {
					return holiday.date == tmpDate;
				});
				if(![0,6].includes(moment(tmpDate).day()) && !findPto && !findHoliday){
					duration -= 8;
				}
			}
			endDate = tmpDate;
			await connection.close();
		}
	}catch(err){
		console.log(err);
	}finally{
		return endDate;
	}
	
};

export async function recalcWorklogEndDate(ptoStartDate,employeeId){
	try{
		let startDate = moment(ptoStartDate + ' 00:00:00').format('X') * 1000,
			query = null,
			connection = null;
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		//get pto list
		query = r.db('work_genius').table('pto')
			.filter({applicant_id:employeeId})
			.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
			.filter(r.row('hours').coerceTo('number').ge(8))
			.pluck('start_date','end_date','hours').coerceTo('array');
		let ptoList = await query.run(connection);

		//get user info
		query = r.db('work_genius').table('users')
			.get(employeeId).pluck('id','location');
		let user = await query.run(connection);
		//get public holiday list
		let location = user.location;
		query = r.db('work_genius').table('holiday').filter({'location':location})
			.pluck('date','type').coerceTo('array');
		let holidayList = await query.run(connection);

		//get the worklog list that need to refresh the end date
		query = r.db('work_genius').table('worklog').filter({status:0,employee_id:employeeId})
			.filter(r.row('start_date').le(startDate).and(r.row('end_date').ge(startDate)))
			.coerceTo('array');
		let worklogList = await query.run(connection);
		if(worklogList && worklogList.length > 0){
			worklogList.forEach( async log => {
				let duration = log.duration,
				tmpDate = log.start_date;
				//calc the end date
				while(duration >0 ){
					let findPto = ptoList.find(pto => {
						if(moment(pto.start_date).isSame(moment(pto.end_date))){
							return moment(tmpDate).isSame(pto.start_date,'day');
						}else{
							return moment(tmpDate).isBetween(pto.start_date,pto.end_date)
								|| moment(tmpDate).isSame(pto.start_date,'day')
								|| moment(tmpDate).isSame(pto.end_date,'day');
						}
					});
					// check if public holiday
					let findHoliday = holidayList.find( holiday => {
						return moment(holiday.date).isSame(tmpDate,'day');
					});
					if(![0,6].includes(moment(tmpDate).day()) && !findPto && !findHoliday){
						duration -= 8;
						if(duration <= 0){
							break;
						}
					}
					tmpDate = tmpDate + 1000 * 60 *60 * 24;
				}
				log.end_date = tmpDate;
				query = r.db('work_genius').table('worklog').get(log.id).update({end_date:tmpDate});
				await query.run(connection);
			});
		}
		await connection.close();
	}
	catch(err){
		console.log(err);
	}
}