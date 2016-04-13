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

				//get all worklog list in current date range
				query = r.db('work_genius').table('worklog').filter(r.row('date').ge(startDate).and(r.row('date').le(endDate)))
					.group('employee_id','date').coerceTo('array');
				let worklogList = await query.run(connection);

				//get all dates and check if the date is weekend or not
				let dateList = [];
				for(let i=0; i < dateRange; i++){
					let tmpDate  = startDate + i * 1000 * 3600 * 24;
					dateList.push({
						date: tmpDate,
						type: [0,6].includes(moment(tmpDate).day())? 'holiday':'workday'
					});
				} 

				//get all public holiday
				query = r.db('work_genius').table('holiday')
					.filter(r.row('date').ge(startDate).and(r.row('date').le(endDate))).coerceTo('array');  
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
							dateItem.type = 'pto';
						}

						//set public holiday info
						let findHoliday = holidayList.find( holiday => {
							return holiday.date == dateItem.date && holiday.location == userItem.location;
						});
						if(!!findHoliday){
							dateItem.type = findHoliday.type;
						}
					});

					//set the worklog items of current day
					userItem.worklogs.forEach(dateItem => {
						let logObj = worklogList.find(log =>{
							return log.group.includes(user.id) && log.group.includes(dateItem.date);
						});

						if(logObj){
							dateItem.worklog_items = logObj.reduction;
						}
					});
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
				//get user info
				let user = await query.run(connection); 

				//get all PTO data
				query = r.db('work_genius').table('pto').filter({status:'APPROVED',applicant_id: employeeId}).filter(r.row('hours').coerceTo('number').ge(8))
					.pluck('applicant_id','start_date','end_date','hours').coerceTo('array');
				let ptoList = await query.run(connection);

				//get all worklog list in current date range
				query = r.db('work_genius').table('worklog').filter(r.row('date').ge(startDate).and(r.row('date').le(endDate)))
					.filter({employee_id : employeeId}).group('date').coerceTo('array');
				let worklogList = await query.run(connection);

				//get all dates and check if the date is weekend or not
				let dateList = [];
				for(let i=0; i < dateRange; i++){
					let tmpDate  = startDate + i * 1000 * 3600 * 24;
					dateList.push({
						date: tmpDate,
						type: [0,6].includes(moment(tmpDate).day())? 'holiday':'workday'
					});
				} 

				//get all public holiday
				query = r.db('work_genius').table('holiday').filter({location : user.location})
					.filter(r.row('date').ge(startDate).and(r.row('date').le(endDate))).coerceTo('array');  
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
							return moment(dateItem.date).isSame(moment(pto.start_date));
						}else{
							return moment(dateItem.date).isBetween(pto.start_date,pto.end_date);
						}
					});
					if(!!findPTO){
						dateItem.type = 'pto';
					}

					//set public holiday info
					let findHoliday = holidayList.find( holiday => {
						return holiday.date == dateItem.date;
					});
					if(!!findHoliday){
						dateItem.type = findHoliday.type;
					}
				});

				//set the worklog items of current day
				userItem.worklogs.forEach(dateItem => {
					let logObj = worklogList.find(log =>{
						return log.group == dateItem.date;
					});

					if(logObj){
						dateItem.worklog_items = logObj.reduction;
					}
				});
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