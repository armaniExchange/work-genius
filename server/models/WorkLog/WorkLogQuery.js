// Models
import WorkLog_TYPE from './WorkLogType.js';
import UserType from '../User/UserType.js';
// GraphQL
import {
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLFloat,
	GraphQLObjectType
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT, ADMIN_ID,TESTER_ID } from '../../constants/configurations.js';
import moment from 'moment';

let WorkLogQuery = {
	'getWorkLogList': {
		type: new GraphQLList(UserType),
		description: 'Get all worklog',
        args: {
			startDate: {
				type: GraphQLFloat,
				description: 'the start date of the query'
			},
			dateRange: {
				type: GraphQLInt,
				description: 'the date range of the query'
			}
		},
		resolve: async (root, { startDate , dateRange}) => {
			let connection = null,
			    result = [],
				query = null;

			try {
				if(dateRange <= 0){
					return result;
				}
				let endDate = startDate + (dateRange -1) * 1000 * 3600 * 24;
				query = r.db('work_genius').table('users').filter(r.row('id').ne(ADMIN_ID).and(r.row('id').ne(TESTER_ID)))
					.pluck('id','name','location').coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				//get all users
				let users = await query.run(connection); 

				//get all PTO data
				query = r.db('work_genius').table('pto').filter({status:'APPROVED'}).filter(r.row('hours').coerceTo('number').ge(8))
					.pluck('applicant_id','start_date','end_date','hours').coerceTo('array');
				let ptoList = await query.run(connection);

				//get all uncompleted worklog list
				query = r.db('work_genius').table('worklog').filter({status:0}).orderBy('start_date').coerceTo('array');
				let worklogList = await query.run(connection);

				//get all dates and check if the date is weekend or not
				let dateList = [];
				for(let i=0; i < dateRange; i++){
					let tmpDate  = startDate + i * 1000 * 3600 * 24;
					dateList.push({
						date: tmpDate,
						day_type: [0,6].includes(moment(tmpDate).day())? 'holiday':'workday'
					});
				} 

				console.log('dateList:');
				console.log(dateList);
				console.log();

				//get all public holiday
				let holidayStartDate = startDate;
				if(worklogList && worklogList.length>0 && worklogList[0].start_date){
					holidayStartDate = worklogList[0].start_date;
				}
				query = r.db('work_genius').table('holiday')
					.filter(r.row('date').ge(holidayStartDate)).coerceTo('array');  
				let holidayList = await query.run(connection);

				//construct the result array
				for(let user of users){
					let userItem = {...user,worklogs:[]};
					for(let dateItem of dateList){
						userItem.worklogs.push(Object.assign({},dateItem));
					}

					userItem.worklogs.forEach(dateItem => {
						//set pto info
						let findPTO = ptoList.find( pto => {
							if(moment(pto.start_date).isSame(moment(pto.end_date))){
								return pto.applicant_id == user.id
									&& moment(dateItem.date).isSame(moment(pto.start_date));
							}else{
								return pto.applicant_id == user.id
									&& moment(dateItem.date).isBetween(pto.start_date,pto.end_date);
							}
						});
						if(!!findPTO){
							dateItem.day_type = 'pto';
						}

						//set public holiday info
						let findHoliday = holidayList.find( holiday => {
							return holiday.date == dateItem.date && holiday.location == userItem.location;
						});
						if(!!findHoliday){
							dateItem.day_type = findHoliday.type;
						}
					});

					//get all my worklog list 
					let myWorkLogList = worklogList.filter(log => {
						return log.employee_id === userItem.id;
					});
					//assign the worklog to proper date
					// According to UI layer's requirement, we should display the worklog every day in its duration.
					// For example, worklog {start_date: '2016-04-01',duration:16}, we should return this worklog in 
					// ['2016-04-01','2016-04-02']
					// Note: 1. we should jump over the pto and pulbic holiday when assigning the worklog
					// 2. the duration of worklog means work hours.
					if(myWorkLogList && myWorkLogList.length>0){
						for(let log of myWorkLogList){
							if(log.duration <= 8){
								// if the duartion of work log is lower than 8,
								// we just assign it to its start date
								if(log.start_date < startDate){
									continue;
								}else{
									let targetItem = userItem.worklogs.find(dateItem => {
										return moment(dateItem.date).isSame(log.start_date,'day');
									});
									if(targetItem){
										targetItem.worklog_items = targetItem.worklog_items || [];
										targetItem.worklog_items.push(log);
									}
								}
							}else{
								let duration = log.duration;
								let tmpDate = log.start_date;
								while(duration > 0 && tmpDate <= endDate){
									if(tmpDate >= startDate){
										let targetItem = userItem.worklogs.find(dateItem => {
											return moment(dateItem.date).isSame(tmpDate,'day');
										});
										if(!!targetItem && targetItem.day_type != 'pto' && targetItem.day_type != 'holiday'){
											targetItem.worklog_items = targetItem.worklog_items || [];
											targetItem.worklog_items.push(log);
											duration -= 8;
										}
										
									}else{
										//check if pto
										let findPto = ptoList.find(pto => {
											if(moment(pto.start_date).isSame(moment(pto.end_date))){
												return pto.applicant_id == userItem.id
													&& moment(tmpDate).isSame(moment(pto.start_date,'day'));
											}else{
												return pto.applicant_id == userItem.id
													&& moment(tmpDate).isBetween(pto.start_date,pto.end_date);
											}
										});
										// check if public holiday
										let findHoliday = holidayList.find( holiday => {
											return holiday.date == tmpDate && holiday.location == userItem.location;
										});
										if(![0,6].includes(moment(tmpDate).day()) && !findPto && !findHoliday){
											duration -= 8;
										}
		
									}
									tmpDate = tmpDate + 1000*60*60*24;
								}
							}
						}
					}
					result.push(userItem);
				}
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'getWorkLogByEmployeeId': {
		type: new GraphQLList(UserType),
		description: 'Get all worklog of selected user',
        args: {
			startDate: {
				type: GraphQLFloat,
				description: 'the start date of the query'
			},
			dateRange: {
				type: GraphQLInt,
				description: 'the date range of the query'
			},
			employeeId: {
				type: GraphQLString,
				description: 'the employee id'
			}
		},
		resolve: async (root, { startDate , dateRange , employeeId}) => {
			let connection = null,
			    result = [],
				query = null;

			try {
				if(dateRange <= 0){
					return result;
				}
				let endDate = startDate + (dateRange -1) * 1000 * 3600 * 24;
				query = r.db('work_genius').table('users').get(employeeId).pluck('id','name','location');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				//get all users
				let user = await query.run(connection); 

				//get all PTO data
				query = r.db('work_genius').table('pto').filter({status:'APPROVED',applicant_id:employeeId})
					.filter(r.row('hours').coerceTo('number').ge(8))
					.pluck('applicant_id','start_date','end_date','hours').coerceTo('array');
				let ptoList = await query.run(connection);

				//get all uncompleted worklog list
				query = r.db('work_genius').table('worklog').filter({status:0,employee_id:employeeId})
					.orderBy('start_date').coerceTo('array');
				let worklogList = await query.run(connection);

				//get all dates and check if the date is weekend or not
				let dateList = [];
				for(let i=0; i < dateRange; i++){
					let tmpDate  = startDate + i * 1000 * 3600 * 24;
					dateList.push({
						date: tmpDate,
						day_type: [0,6].includes(moment(tmpDate).day())? 'holiday':'workday'
					});
				} 

				//get all public holiday
				let holidayStartDate = startDate;
				if(worklogList && worklogList.length>0 && worklogList[0].start_date){
					holidayStartDate = worklogList[0].start_date;
				}
				query = r.db('work_genius').table('holiday').filter({location:user.location})
					.filter(r.row('date').ge(holidayStartDate)).coerceTo('array');  
				let holidayList = await query.run(connection);

				//construct the result array
				let userItem = {...user,worklogs:[]};
				for(let dateItem of dateList){
					userItem.worklogs.push(Object.assign({},dateItem));
				}

				userItem.worklogs.forEach(dateItem => {
					//set pto info
					let findPTO = ptoList.find( pto => {
						if(moment(pto.start_date).isSame(moment(pto.end_date))){
							return pto.applicant_id == user.id
								&& moment(dateItem.date).isSame(moment(pto.start_date));
						}else{
							return pto.applicant_id == user.id
								&& moment(dateItem.date).isBetween(pto.start_date,pto.end_date);
						}
					});
					if(!!findPTO){
						dateItem.day_type = 'pto';
					}

					//set public holiday info
					let findHoliday = holidayList.find( holiday => {
						return holiday.date == dateItem.date && holiday.location == userItem.location;
					});
					if(!!findHoliday){
						dateItem.day_type = findHoliday.type;
					}
				});

				//get all my worklog list 
				let myWorkLogList = worklogList.filter(log => {
					return log.employee_id === userItem.id;
				});
				//assign the worklog to proper date
				// According to UI layer's requirement, we should display the worklog every day in its duration.
				// For example, worklog {start_date: '2016-04-01',duration:16}, we should return this worklog in 
				// ['2016-04-01','2016-04-02']
				// Note: 1. we should jump over the pto and pulbic holiday when assigning the worklog
				// 2. the duration of worklog means work hours.
				if(myWorkLogList && myWorkLogList.length>0){
					for(let log of myWorkLogList){
						if(log.duration <= 8){
							// if the duartion of work log is lower than 8,
							// we just assign it to its start date
							if(log.start_date < startDate){
								continue;
							}else{
								let targetItem = userItem.worklogs.find(dateItem => {
									return moment(dateItem.date).isSame(log.start_date,'day');
								});
								if(targetItem){
									targetItem.worklog_items = targetItem.worklog_items || [];
									targetItem.worklog_items.push(log);
								}
							}
						}else{
							let duration = log.duration;
							let tmpDate = log.start_date;
							while(duration > 0 && tmpDate <= endDate){
								if(tmpDate >= startDate){
									let targetItem = userItem.worklogs.find(dateItem => {
										return moment(dateItem.date).isSame(tmpDate,'day');
									});
									if(!!targetItem && targetItem.day_type != 'pto' && targetItem.day_type != 'holiday'){
										targetItem.worklog_items = targetItem.worklog_items || [];
										targetItem.worklog_items.push(log);
										duration -= 8;
									}
									
								}else{
									//check if pto
									let findPto = ptoList.find(pto => {
										if(moment(pto.start_date).isSame(moment(pto.end_date))){
											return pto.applicant_id == userItem.id
												&& moment(tmpDate).isSame(moment(pto.start_date,'day'));
										}else{
											return pto.applicant_id == userItem.id
												&& moment(tmpDate).isBetween(pto.start_date,pto.end_date);
										}
									});
									// check if public holiday
									let findHoliday = holidayList.find( holiday => {
										return holiday.date == tmpDate && holiday.location == userItem.location;
									});
									if(![0,6].includes(moment(tmpDate).day()) && !findPto && !findHoliday){
										duration -= 8;
									}
	
								}
								tmpDate = tmpDate + 1000*60*60*24;
							}
						}
					}
				}
				result.push(userItem);
				
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default WorkLogQuery;