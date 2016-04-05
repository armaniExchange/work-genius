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
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

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
				query = r.db('work_genius').table('bugs').filter(filter).group('resolved_type').count();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let rootCauseSummary = await query.run(connection); 
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

			const rootCauseList = [
				'GUI Code Issue',
				'AXAPI',
				'Look and Feel',
				'Requirement Change',
				'Browser Related'
			];

			try {
				if(label){
					filter.label = label;
				}
				query = r.db('work_genius').table('bugs').filter(filter).group('assigned_to','resolved_type').count();
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
				query = r.db('work_genius').table('users').filter(function(user){
					return user('email').match('@a10networks.com')
				}).pluck('name','email').coerceTo('array');
				console.log('ownerSummary:');
				console.log(ownerSummary);

				// construct the result
				// the pattern:
				// [{
					// 	name : 'Yushan Hou',
					// 	item1 : 1 , //Gui code issue
					// 	item2 : 2, //AXAPI
					// 	item3 : 3 , //Look and feel
					// 	item4 : 4, //Requirement change
					// 	item5 : 5 //Browser related
				// }]
				let users = await query.run(connection);

				for(let user of users){
					console.log('user:' + user.name);
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
							console.log('itemSummary:');
							console.log(itemSummary);
							console.log();
							if(itemSummary && itemSummary.length > 0){
								console.log('itemSummary:');
								console.log(itemSummary[0].reduction);
								console.log();
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
				query = r.db('work_genius').table('bugs').group(r.row('tags'), {multi: true})
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
	}
};

export default BugStats;