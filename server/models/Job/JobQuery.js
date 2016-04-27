// Models
import JobType from './JobType.js';
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

let JobQuery = {
	'getJobList': {
		type: new GraphQLList(UserType),
		description: 'Get all jobs',
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
				query = r.db('work_genius').table('pto')
					.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
					.pluck('applicant_id','start_date','end_date','hours').coerceTo('array');
				let ptoList = await query.run(connection);

				//get all uncompleted job list
				query = r.db('work_genius').table('worklog').eqJoin('job_id',r.db('work_genius').table('jobs'))
					.without({left:"job_id"}).zip()
					.filter(r.js('(function(row){ \
						return (row.start_date >= '+startDate+' && row.start_date <= '+endDate+') \
							|| (row.start_date < '+startDate+' && row.end_date >= '+startDate+' )\
						})'))
					.coerceTo('array');
				let jobList = await query.run(connection);

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
				query = r.db('work_genius').table('holiday')
					.filter(r.row('date').ge(startDate)).coerceTo('array');  
				let holidayList = await query.run(connection);

				//construct the result array
				for(let user of users){
					let userItem = {...user,jobs:[]};
					for(let dateItem of dateList){
						userItem.jobs.push(Object.assign({},dateItem));
					}

					userItem.jobs.forEach(dateItem => {
						//set pto info
						let findPTO = ptoList.find( pto => {
							if(moment(pto.start_date).isSame(moment(pto.end_date))){
								return pto.applicant_id == user.id
									&& moment(dateItem.date).isSame(moment(pto.start_date));
							}else{
								return pto.applicant_id == user.id
									&& (moment(dateItem.date).isBetween(pto.start_date,pto.end_date)
										|| moment(dateItem.date).isSame(pto.start_date,'day')
										|| moment(dateItem.date).isSame(pto.end_date,'day'));
							}
						});
						if(!!findPTO){
							dateItem.pto_hours = Number.parseInt(findPTO.hours);
							if(dateItem.pto_hours >= 8){
								dateItem.day_type = 'pto';
							}
						}

						//set public holiday info
						let findHoliday = holidayList.find( holiday => {
							return holiday.date == dateItem.date && holiday.location == userItem.location;
						});
						if(!!findHoliday){
							dateItem.day_type = findHoliday.type;
						}
					});

					//get all my job list 
					let myJobList = jobList.filter(job => {
						return job.employee_id === userItem.id;
					});

					//assign the job to the proper date
					if(myJobList && myJobList.length > 0){
						myJobList.forEach(job => {
							let tmpStartDate = startDate > job.start_date ? startDate: job.start_date;
							let tmpEndDate = endDate > job.end_date ? job.end_date : endDate;
							for(let date = tmpStartDate ; date <= tmpEndDate; date += 1000 * 60 * 60 * 24){
								let dateItem = userItem.jobs.find(dateItem => {
									return moment(dateItem.date).isSame(date,'day');
								})
								if(dateItem && dateItem.day_type == 'workday'){
									dateItem.job_items = dateItem.job_items || [];
									dateItem.job_items.push(job);
								}
							}
						});
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
	'getJobByEmployeeId': {
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
				query = null,
			    result = [];

			try {
				if(dateRange <= 0){
					return result;
				}
				let endDate = startDate + (dateRange -1) * 1000 * 3600 * 24;
				query = r.db('work_genius').table('users').get(employeeId)
					.pluck('id','name','location');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				//get all users
				let user = await query.run(connection);

				//get all PTO data
				query = r.db('work_genius').table('pto')
					.filter({applicant_id : employeeId})
					.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
					.pluck('applicant_id','start_date','end_date','hours').coerceTo('array');
				let ptoList = await query.run(connection);

				//get all uncompleted job list
				query = r.db('work_genius').table('worklog').eqJoin('job_id',r.db('work_genius').table('jobs'))
					.without({left:"job_id"}).zip()
					.filter({employee_id: employeeId})
					.filter(r.js('(function(row){ \
						return (row.start_date >= '+startDate+' && row.start_date <= '+endDate+') \
							|| (row.start_date < '+startDate+' && row.end_date >= '+startDate+' )\
						})'))
					.coerceTo('array');
				let jobList = await query.run(connection);

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
				query = r.db('work_genius').table('holiday').filter({location: user.location})
					.filter(r.row('date').ge(startDate)).coerceTo('array');  
				let holidayList = await query.run(connection);

				//construct the result array
				let userItem = {...user,jobs:[]};
				for(let dateItem of dateList){
					userItem.jobs.push(Object.assign({},dateItem));
				}

				userItem.jobs.forEach(dateItem => {
					//set pto info
					let findPTO = ptoList.find( pto => {
						if(moment(pto.start_date).isSame(moment(pto.end_date))){
							return pto.applicant_id == user.id
								&& moment(dateItem.date).isSame(moment(pto.start_date));
						}else{
							return pto.applicant_id == user.id
								&& (moment(dateItem.date).isBetween(pto.start_date,pto.end_date)
									|| moment(dateItem.date).isSame(pto.start_date,'day')
									|| moment(dateItem.date).isSame(pto.end_date,'day'));
						}
					});
					if(!!findPTO){
						dateItem.pto_hours = Number.parseInt(findPTO.hours);
						if(dateItem.pto_hours >= 8){
							dateItem.day_type = 'pto';
						}
					}

					//set public holiday info
					let findHoliday = holidayList.find( holiday => {
						return holiday.date == dateItem.date && holiday.location == userItem.location;
					});
					if(!!findHoliday){
						dateItem.day_type = findHoliday.type;
					}
				});

				//assign the job to the proper date
				if(jobList && jobList.length > 0){
					jobList.forEach(job => {
						let tmpStartDate = startDate > job.start_date ? startDate: job.start_date;
						let tmpEndDate = endDate > job.end_date ? job.end_date : endDate;
						for(let date = tmpStartDate ; date <= tmpEndDate; date += 1000 * 60 * 60 * 24){
							let dateItem = userItem.jobs.find(dateItem => {
								return moment(dateItem.date).isSame(date,'day');
							})
							if(dateItem && dateItem.day_type == 'workday'){
								dateItem.job_items = dateItem.job_items || [];
								dateItem.job_items.push(job);
							}
						}
					});
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

export default JobQuery;