// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import moment from 'moment';

//calc the end date of job
//we need to jump over the weekend/public holiday/pto
export async function getJobEndDate(job){
	let endDate = 0 ,
		query = null,
		connection = null;
	try{
		//add default value
		endDate = job.start_date;
		if(job.duration <= 8){
			endDate = job.start_date + job.duration * 1000 * 60 * 60;
		}
		else{
			connection = await r.connect({ host: DB_HOST, port: DB_PORT });

			//get pto list
			query = r.db('work_genius').table('pto')
				.filter({applicant_id:job.employee_id})
				.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
				.filter(r.row('hours').coerceTo('number').ge(8))
				.pluck('start_time','end_time','hours').coerceTo('array');
			let ptoList = await query.run(connection);

			//get public holiday list
			query = r.db('work_genius').table('users')
				.get(job.employee_id).pluck('id','location');
			let user = await query.run(connection);
			let location = user.location;
			query = r.db('work_genius').table('holiday').filter({'location':location})
				.filter(r.row('date').ge(job.start_date))
				.pluck('date','type').coerceTo('array');
			let holidayList = await query.run(connection);

			let duration = job.duration - 8,
				tmpDate = job.start_date;
			//calc the end date
			while(duration >0 ){
				tmpDate = tmpDate + 1000 * 60 *60 * 24;
				let findPto = ptoList.find(pto => {
					let startTime = Number.parseFloat(pto.start_time);
					let endTime = Number.parseFloat(pto.end_time);
					if(moment(startTime).isSame(endTime,'day')){
						return moment(tmpDate).isSame(startTime,'day');
					}else{
						return moment(tmpDate).isBetween(startTime,endTime)
							|| moment(tmpDate).isSame(startTime)
							|| moment(tmpDate).isSame(endTime);
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

export async function recalcJobEndDate(ptoStartDate,employeeId){
	try{
		let startDate = moment(Number.parseFloat(ptoStartDate)).hour(0).minute(0).second(0).format('X') * 1000,
			query = null,
			connection = null;
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		console.log('startDate:');
		console.log(startDate);
		console.log();
		//get pto list
		query = r.db('work_genius').table('pto')
			.filter({applicant_id:employeeId})
			.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
			.filter(r.row('hours').coerceTo('number').ge(8))
			.pluck('start_time','end_time','hours').coerceTo('array');
		let ptoList = await query.run(connection);

		console.log('ptolist:');
		console.log(ptoList);
		console.log();

		//get user info
		query = r.db('work_genius').table('users')
			.get(employeeId).pluck('id','location');
		let user = await query.run(connection);
		//get public holiday list
		let location = user.location;
		query = r.db('work_genius').table('holiday').filter({'location':location})
			.pluck('date','type').coerceTo('array');
		let holidayList = await query.run(connection);

		console.log('holidayList:');
		console.log(holidayList);
		console.log();

		//get the worklog list that need to refresh the end date
		query = r.db('work_genius').table('jobs').filter({status:0,employee_id:employeeId})
			.filter(r.row('start_date').le(startDate).and(r.row('end_date').ge(startDate)))
			.coerceTo('array');
		let jobList = await query.run(connection);

		console.log('jobList:');
		console.log(jobList);
		console.log();
		if(jobList && jobList.length > 0){
			jobList.forEach( async job => {
				let duration = job.duration,
				tmpDate = job.start_date;
				//calc the end date
				while(duration >0 ){
					let findPto = ptoList.find(pto => {
						let startTime = Number.parseFloat(pto.start_time);
						let endTime = Number.parseFloat(pto.end_time);
						if(moment(startTime).isSame(endTime,'day')){
							return moment(tmpDate).isSame(startTime,'day');
						}else{
							return moment(tmpDate).isBetween(startTime,endTime)
								|| moment(tmpDate).isSame(startTime)
								|| moment(tmpDate).isSame(endTime);
						}
					});
					console.log('findPto:');
					console.log(findPto);
					console.log();
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
				job.end_date = tmpDate;
				query = r.db('work_genius').table('jobs').get(job.id).update({end_date:tmpDate});
				await query.run(connection);
			});
		}
		await connection.close();
	}
	catch(err){
		console.log(err);
	}
}