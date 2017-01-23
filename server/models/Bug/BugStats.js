// GraphQL
import {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';
// Models
import BUG_STATS_TYPE from './BugStatsType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT , ADMIN_ID,TESTER_ID } from '../../constants/configurations.js';
import { GUI_GROUP } from '../../constants/group-constant.js';
const MGR_EMAIL = ["chuang@a10networks.com"];

let BugStats = {
	'getRootCauseSummary': {
		type: new GraphQLList(BUG_STATS_TYPE),
		description: 'Get root cause summary',
        args: {
			label: {
				type: GraphQLString,
				description: 'project'
			}
		},
		resolve: async (root, { label}) => {
			let connection = null,
			    result = [],
                filter = {},
				query = null;

			try {
				if(label){
					filter.label = label;
				}
				query = r.db('work_genius').table('bugs_review').filter(filter).group('resolved_type').count();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let rootCauseSummary = await query.run(connection);
				//combine the group = null and group = ''
				if(rootCauseSummary){
					let nullIndex = -1, emptyIndex = -1;
					for(let i = 0; i < rootCauseSummary.length; i++){
						if(rootCauseSummary[i].group === null){
							nullIndex = i;
						}
						if(rootCauseSummary[i].group === ''){
							emptyIndex = i;
						}
					}
					if(nullIndex !=emptyIndex && nullIndex!=-1 && emptyIndex!=-1){
						rootCauseSummary[emptyIndex].reduction += rootCauseSummary[nullIndex].reduction;
						rootCauseSummary.splice(nullIndex,1);
					}
				}

				let totalNumber = 0;
				//get total bug number
				rootCauseSummary.forEach((group) => {
					totalNumber += group.reduction;
				});
				for(let group of rootCauseSummary){
					let item = {
						name : '',
						number : 0,
						percentage : ''
					};
					item.name = group.group || '';
					item.number = group.reduction || 0;
					//get percentage
					if(totalNumber){
						item.percentage = String((item.number/totalNumber * 100).toFixed(2)) + '%';
					}
					result.push(item);
				}

				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'getOwnerRootCauseSummary': {
		type: new GraphQLList(BUG_STATS_TYPE),
		description: 'Get owner root cause summary',
        args: {
			label: {
				type: GraphQLString,
				description: 'project'
			}
		},
		resolve: async (root, { label}) => {
			let connection = null,
			    result = [],
                filter = {},
				query = null;

			const rootCauseList = [
				'GUI Code Issue',
				'AXAPI Changed',
				'Look and Feel',
				'Requirement Change',
				'Browser Related',
				'Others',
				'Cannot be Reproduced',
				'AXAPI Not Supported',
				'GUI Not Supported',
				'Duplicate',
				'NAB/By Design',
				'Working in current build',
				'Enhancement'
			];

			try {
				if(label){
					filter.label = label;
				}
				query = r.db('work_genius').table('bugs_review').filter(filter).group('assigned_to','resolved_type').count();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				//get summary result
				// the pattern of result :
				// [
					// 	{
					// 	"group": [
					// 	"ahuang" ,
					// 	""
					// 	] ,
					// 	"reduction": 94
					// 	} ,
					// 	{
					// 	"group": [
					// 	"ahuang" ,
					// 	"AXAPI"
					// 	] ,
					// 	"reduction": 1
					// 	}
				// ]
				let ownerSummary = await query.run(connection);
				query = r.db('work_genius').table('users').filter(r.row('id').ne(ADMIN_ID).and(r.row('id').ne(TESTER_ID)))
				.filter(function(user){
					return user('groups').default([]).contains(GUI_GROUP);
				})
				.pluck('name','email').coerceTo('array');

				// construct the result
				// the pattern:
				// [{
					// 	name : 'Yushan Hou',
					// 	item1 : 1 , //Gui code issue
					// 	item2 : 2, //AXAPI
					// 	item3 : 3 , //Look and feel
					// 	item4 : 4, //Requirement change
					// 	item5 : 5 //Browser related
					//  item6 : 6 //Others
				// }]
				let users = await query.run(connection);
				for(let user of users){
					let statusItems = ownerSummary.filter( item => {
						return item.group.indexOf(user.email.replace('@a10networks.com','').toLowerCase()) > -1;
					});

					let userSummary = {
						name : user.name
					};
					if(statusItems && statusItems.length > 0){
						rootCauseList.forEach((rootCause,index) => {
							let itemSummary = statusItems.filter((item => {
								return item.group.indexOf(rootCause) > -1;
							}));
							if(itemSummary && itemSummary.length > 0){
								userSummary['item'+String(index+1)] = itemSummary[0].reduction;
							}
						});
					}
					result.push(userSummary);
				}


				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'getBugSummary': {
		type: new GraphQLList(BUG_STATS_TYPE),
		description: 'Get bug summary',
        args: {
			label: {
				type: GraphQLString,
				description: 'project'
			}
		},
		resolve: async (root, { label}) => {
			let connection = null,
			    result = [],
                filter = {},
				query = null;

			try {
				if(label){
					filter.label = label;
				}
				query = r.db('work_genius').table('bugs_review').group(r.row('tags'), {multi: true})
					.count().ungroup().orderBy(r.desc('reduction'));
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let bugSummary = await query.run(connection);
				console.log('bugSummary:');
				console.log(bugSummary);
				if(bugSummary){
					bugSummary = bugSummary.slice(0,10);
				}
				let totalNumber = 0;
				//get total  number
				bugSummary.forEach((group) => {
					totalNumber += group.reduction;
				});
				for(let group of bugSummary){
					let item = {
						name : '',
						number : 0,
						percentage : ''
					};
					item.name = group.group || '';
					item.number = group.reduction || 0;
					//get percentage
					if(totalNumber){
						item.percentage = String((item.number/totalNumber * 100).toFixed(2)) + '%';
					}
					result.push(item);
				}

				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'getOwnerSummary': {
		type: new GraphQLList(BUG_STATS_TYPE),
		description: 'Get owner summary',
        args: {
			label: {
				type: GraphQLString,
				description: 'project'
			}
		},
		resolve: async (root, { label}) => {
			let connection = null,
			    result = [],
                filter = {},
				query = null;

			try {
				if(label){
					filter.label = label;
				}
				query = r.db('work_genius').table('bugs_review').filter(filter).group('assigned_to').count();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let OwnerSummary = await query.run(connection);

				query = r.db('work_genius').table('users')
				.filter(function(user){
					return user('groups').default([]).contains(GUI_GROUP);
				})
				.filter(r.row('id').ne(ADMIN_ID).and(r.row('id').ne(TESTER_ID))).pluck('email','name').coerceTo('array');
				let userList = await query.run(connection);


				let totalNumber = 0;
				//get total bug number
				OwnerSummary.forEach((group) => {
					totalNumber += group.reduction;
				});
				for(let group of OwnerSummary){
					if(group.group.indexOf('bugzilla') > -1){
						continue;
					}
					let item = {
						name : '',
						number : 0,
						percentage : ''
					};

					item.name = group.group || '';
					//get user name
					let user = userList.filter((user) => {
						return user.email.replace('@a10networks.com','').toLowerCase() == group.group;
					});
					if(user && user.length > 0){
						item.name = user[0].name;
					}

					item.number = group.reduction || 0;
					//get percentage
					if(totalNumber){
						item.percentage = String((item.number/totalNumber * 100).toFixed(2));
					}
					result.push(item);
				}

				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'getBugPerformance': {
		type: new GraphQLList(BUG_STATS_TYPE),
		description: 'Get bugs performance',
        args: {
			
		},
		resolve: async (root, { }) => {
			let connection = null,
			    result = [],
			    labelList = [
					"4.1.1",
					"4.1.1-p1",
					"4.1.1-p2",
					"4.1.0-p5",
					"4.1.0-p6",
					"4.1.0-p7",
					"4.1.0-p8"
				],
				introducedByList = [
					"New feature",   //a
					"Your own module",  //b
					'Help other team member',  //c 
					"Enhancement bug/won’t fix/reproducible",
					null
				],
				nullIndex = String(introducedByList.indexOf(null) + 1),
			    filter = bug => {
			    	return r.expr(labelList).contains(bug('label'));
			    },
				query = null;

			try {
				query = r.db('work_genius').table('bugs_review').filter(filter).group('assigned_to', 'introduced_by').count();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let perfSummary = await query.run(connection);

				query = r.db('work_genius').table('users').filter(r.row('id').ne(ADMIN_ID).and(r.row('id').ne(TESTER_ID)))
				.filter(function(user){
					return user('groups').default([]).contains(GUI_GROUP);
				})
				.pluck('name','email').coerceTo('array');

				let userList = await query.run(connection);
				for(let user of userList){
					if(MGR_EMAIL.indexOf(user.email) > -1){
						continue;
					}
					let item = { "name": user.name , "seniority" : 1.0};
					for(let perf of perfSummary){
						if(perf.group && perf.group.length > 0 && perf.group[0] === user.email.replace('@a10networks.com','').toLowerCase()){
							if(perf.group.length > 1 ){
								if(perf.group[1] !== null && perf.group[1].length > 0){
									let introduced_by = perf.group[1][0];
									item["item" + String(introducedByList.indexOf(introduced_by)+1)] = perf.reduction || 0;
								}else{
									item["item" + nullIndex] = perf.reduction || 0;
								}	
							}
						}
					}
					//cal method c/(a+b)e
					item.item1 = item.item1 || 0;
					item.item2 = item.item2 || 0;
					item.item3 = item.item3 || 0;
					item.item4 = item.item4 || 0;
					item.item5 = item.item5 || 0;

					// (a+b) === 0
					if( (item.item1 + item.item2) === 0){
						item["score"] = 0;
					} else{
						item["score"] = Math.floor(item.item3 * 100/(item.item1 + item.item2) * item["seniority"]) / 100;
					}
					result.push(item);
				}

				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default BugStats;
