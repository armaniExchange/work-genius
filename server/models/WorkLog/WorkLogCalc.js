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
	}
	catch(err){
		console.log(err);
	}
}