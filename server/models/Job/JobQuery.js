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
import { GUI_GROUP } from '../../constants/group-constant.js';

let DAY_DURATION = 8;

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
			},
			timezone: {
				type: GraphQLInt,
				description: 'the timezone of user'
			}
		},
		resolve: async (root, { startDate , dateRange,timezone}) => {
			let connection = null,
			    result = [],
				query = null;

			try {
				if(dateRange <= 0){
					return result;
				}
				let endDate = startDate + (dateRange -1) * 1000 * 3600 * 24;
				query = r.db('work_genius').table('users').filter(r.row('id').ne(ADMIN_ID).and(r.row('id').ne(TESTER_ID)))
					.filter(function(user){
						return user('groups').default([]).contains(GUI_GROUP);
					})
					.pluck('id','name','location','timezone').orderBy('location').coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				//get all users
				let users = await query.run(connection);

				//get all PTO data
				query = r.db('work_genius').table('pto')
					.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
					.pluck('applicant_id','start_time','end_time','hours').coerceTo('array');
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
						day_type: [0,6].includes(moment(tmpDate).utcOffset(timezone).day())? 'weekend':'workday'
					});
				} 

				//get all public holiday
				query = r.db('work_genius').table('holiday').coerceTo('array');  
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
							let startTime = Number.parseFloat(pto.start_time);
							let endtTime = Number.parseFloat(pto.end_time);
							if(moment(startTime).utcOffset(timezone).isSame(endtTime,'day')){
								return pto.applicant_id == user.id
									&& moment(dateItem.date).utcOffset(timezone).isSame(startTime,'day');
							}else{
								return pto.applicant_id == user.id
									&& (moment(dateItem.date).utcOffset(timezone).isBetween(startTime,endtTime)
										|| moment(dateItem.date).utcOffset(timezone).isSame(startTime,'day')
										|| moment(dateItem.date).utcOffset(timezone).isSame(endtTime,'day'));
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
							return moment(holiday.date).utcOffset(timezone).isSame(dateItem.date,'day') && holiday.location == userItem.location;
						});
						if(!!findHoliday && dateItem.day_type != 'pto'){
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
							let tmpStartDate = job.start_date;
							let tmpEndDate = endDate > job.end_date ? job.end_date : endDate;
							for(let date = tmpStartDate ; date <= tmpEndDate; date += 1000 * 60 * 60 * 24){
								let dateItem = userItem.jobs.find(dateItem => {
									return moment(dateItem.date).utcOffset(timezone).isSame(date,'day');
								})
								if(dateItem){
									let createdTimezone = job.timezone ? job.timezone : user.timezone;
									if(createdTimezone != timezone){
										let day = moment(date).utcOffset(createdTimezone).day();
										if((dateItem.day_type == 'workday' || dateItem.day_type == 'weekend')
											&& [1,2,3,4,5].includes(day)){
											dateItem.job_items = dateItem.job_items || [];
											dateItem.job_items.push(Object.assign({},job));
										}
									}else{
										if(dateItem.day_type == 'workday'){
											dateItem.job_items = dateItem.job_items || [];
											dateItem.job_items.push(Object.assign({},job));
										}
									}
								}
							}
						});
					}

					//get the total workday number of the job
					let getTotalDays = (jobStartDate,jobEndDate,createdTimezone) =>{
						let totalDays = 0;

						while(moment(jobStartDate).utcOffset(createdTimezone).isBefore(jobEndDate,'day') 
							|| moment(jobStartDate).utcOffset(createdTimezone).isSame(jobEndDate,'day')){
							let findPTO = ptoList.find( pto => {
								let startTime = Number.parseFloat(pto.start_time);
								let endtTime = Number.parseFloat(pto.end_time);
								if(moment(startTime).utcOffset(createdTimezone).isSame(endtTime,'day')){
									return pto.applicant_id == user.id
										&& moment(jobStartDate).utcOffset(createdTimezone).isSame(startTime,'day');
								}else{
									return pto.applicant_id == user.id && 
											(moment(jobStartDate).utcOffset(createdTimezone).isBetween(startTime,endtTime)
											|| moment(jobStartDate).utcOffset(createdTimezone).isSame(startTime,'day')
											|| moment(jobStartDate).utcOffset(createdTimezone).isSame(endtTime,'day'));
								}
							});
							if(!!findPTO){
								if(findPTO.hours >= 8){
									jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
									continue;
								}
							}

							//set public holiday info
							let findHoliday = holidayList.find( holiday => {
								return moment(holiday.date).utcOffset(createdTimezone).isSame(jobStartDate,'day') 
									&& holiday.location == userItem.location;
							});
							if(!!findHoliday){
								if(findHoliday.type == 'holiday'){
									jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
									continue;
								}
								
							}else{
								let day = moment(jobStartDate).utcOffset(createdTimezone).day();
								if([0,6].includes(moment(jobStartDate).utcOffset(createdTimezone).day()) 
									&& [0,6].includes(day)){
									jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
									continue;
								}
							}
							totalDays++ ;
							jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
						}
						return totalDays;
					};

					//set the daily percentage
					for(let job of userItem.jobs){
						let secs = 1000 * 60 * 60 * 24;
						if(job.job_items && job.job_items.length >0){
							job.job_items.forEach(job_item => {
								let createdTimezone = job_item.timezone ? job_item.timezone : user.timezone;
								job_item.daily_duration = job_item.duration / getTotalDays(job_item.start_date,job_item.end_date,createdTimezone,timezone);
								job_item.daily_percentage = Math.round(job_item.daily_duration / DAY_DURATION * 100);
							});
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
			},
			timezone: {
				type: GraphQLInt,
				description: 'the timezone of user'
			}
		},
		resolve: async (root, { startDate , dateRange , employeeId , timezone}) => {
			let connection = null,				
				query = null,
			    result = [];

			try {
				if(dateRange <= 0 || employeeId == null){
					return result;
				}
				//we'll get the job list one more day
				let endDate = startDate + dateRange * 1000 * 3600 * 24;
				query = r.db('work_genius').table('users').get(employeeId)
					.pluck('id','name','location','timezone');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				//get all users
				let user = await query.run(connection);

				//get all PTO data
				query = r.db('work_genius').table('pto')
					.filter({applicant_id : employeeId})
					.filter(r.row('status').eq('PENDING').or(r.row('status').eq('APPROVED')))
					.pluck('applicant_id','start_time','end_time','hours').coerceTo('array');
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
						day_type: [0,6].includes(moment(tmpDate).utcOffset(timezone).day())? 'weekend':'workday'
					});
				} 

				//get all public holiday
				query = r.db('work_genius').table('holiday').filter({location: user.location}).coerceTo('array');  
				let holidayList = await query.run(connection);

				//construct the result array
				let userItem = {...user,jobs:[]};
				for(let dateItem of dateList){
					userItem.jobs.push(Object.assign({},dateItem));
				}

				userItem.jobs.forEach(dateItem => {
					//set pto info
					let findPTO = ptoList.find( pto => {
						let startTime = Number.parseFloat(pto.start_time);
						let endtTime = Number.parseFloat(pto.end_time);
						if(moment(startTime).utcOffset(timezone).isSame(endtTime,'day')){
							return moment(dateItem.date).utcOffset(timezone).isSame(startTime,'day');
						}else{
							return moment(dateItem.date).utcOffset(timezone).isBetween(startTime,endtTime)
									|| moment(dateItem.date).utcOffset(timezone).isSame(startTime,'day')
									|| moment(dateItem.date).utcOffset(timezone).isSame(endtTime,'day');
						}
					});
					if(!!findPTO){
						dateItem.pto_hours = Number.parseInt(findPTO.hours);
						if(dateItem.pto_hours >= 8){
							dateItem.day_type = 'pto';
						}
					}

					//set public holiday info
					let findHoliday = holidayList.find(holiday => {
						return moment(holiday.date).utcOffset(timezone).isSame(dateItem.date,'day');
					});
					if(!!findHoliday && dateItem.day_type != 'pto'){
						dateItem.day_type = findHoliday.type;
					}
				});

				//assign the job to the proper date
				if(jobList && jobList.length > 0){
					jobList.forEach(job => {
						let tmpStartDate = job.start_date;
						let tmpEndDate = endDate > job.end_date ? job.end_date : endDate;
						for(let date = tmpStartDate ; date <= tmpEndDate; date += 1000 * 60 * 60 * 24){
							let dateItem = userItem.jobs.find(dateItem => {
								return moment(dateItem.date).utcOffset(timezone).isSame(date,'day');
							})
							if(dateItem){
								let createdTimezone = job.timezone ? job.timezone : user.timezone;
								if(createdTimezone != timezone){
									let day = moment(date).utcOffset(createdTimezone).day();
									if((dateItem.day_type == 'workday' || dateItem.day_type == 'weekend')
										&& [1,2,3,4,5].includes(day)){
										dateItem.job_items = dateItem.job_items || [];
										dateItem.job_items.push(Object.assign({},job));
									}
								}else{
									if(dateItem.day_type == 'workday'){
										dateItem.job_items = dateItem.job_items || [];
										dateItem.job_items.push(Object.assign({},job));
									}
								}
							}
						}
					}); 
				}

				//get the total workday number of the job
				let getTotalDays = (jobStartDate,jobEndDate,createdTimezone) =>{
					let totalDays = 0;

					while(moment(jobStartDate).utcOffset(createdTimezone).isBefore(jobEndDate,'day') 
						|| moment(jobStartDate).utcOffset(createdTimezone).isSame(jobEndDate,'day')){
						let findPTO = ptoList.find( pto => {
							let startTime = Number.parseFloat(pto.start_time);
							let endtTime = Number.parseFloat(pto.end_time);
							if(moment(startTime).utcOffset(createdTimezone).isSame(endtTime,'day')){
								return moment(jobStartDate).utcOffset(createdTimezone).isSame(startTime,'day');
							}else{
								return moment(jobStartDate).utcOffset(createdTimezone).isBetween(startTime,endtTime)
										|| moment(jobStartDate).utcOffset(createdTimezone).isSame(startTime,'day')
										|| moment(jobStartDate).utcOffset(createdTimezone).isSame(endtTime,'day');
							}
						});
						if(!!findPTO){
							if(findPTO.hours >= 8){
								jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
								continue;
							}
						}

						//set public holiday info
						let findHoliday = holidayList.find( holiday => {
							return moment(holiday.date).utcOffset(createdTimezone).isSame(jobStartDate,'day');
						});
						if(!!findHoliday){
							if(findHoliday.type == 'holiday'){
								jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
								continue;
							}
							
						}else{
							let day = moment(jobStartDate).utcOffset(createdTimezone).day();
							if([0,6].includes(day)){
								jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
								continue;
							}
						}
						totalDays++ ;
						jobStartDate = jobStartDate + 1000 * 60 * 60 * 24;
					}
					return totalDays;
				};

				// //set the daily percentage
				for(let job of userItem.jobs){
					let secs = 1000 * 60 * 60 * 24;
					if(job.job_items && job.job_items.length >0){
						job.job_items.forEach(job_item => {
							let createdTimezone = job_item.timezone ? job_item.timezone : user.timezone;
							let days = getTotalDays(job_item.start_date,job_item.end_date,createdTimezone);
							job_item.daily_duration = job_item.duration / days;
							job_item.daily_percentage = Math.round(job_item.daily_duration / DAY_DURATION * 100);
						});
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
	},
	'getAllJobTitle': {
		type: new GraphQLList(GraphQLString),
		description: 'Get all job title',
        args: {

		},
		resolve: async (root, { }) => {
			let connection = null,				
				query = null,
			    result = [];

			try {
				let startTime = Number.parseFloat(moment().subtract(30, 'days').format('x'));
				let curTime = Number.parseFloat(moment().format('x'));
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				//get the job title created in latest 30 days and the max number is 500.
				query = r.db('work_genius').table('jobs')
					.filter(function(job){
						return job('create_time').default(curTime).ge(startTime);
					})
					.getField('title').distinct().limit(500).coerceTo('array');
				result = await query.run(connection);
				
				await connection.close();
				return result;
			} catch (err) {
				console.log(err) ;
			}
			return result;
		}
	}
};

export default JobQuery;