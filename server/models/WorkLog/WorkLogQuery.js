// Models
import WorkLog_TYPE from './WorkLogType.js';
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

//get worklog list of selected user
let WorkLogQuery = {
	'getWorkLogByEmployeeId': {
		type: new GraphQLList(WorkLog_TYPE),
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
				dateRange = dateRange || 1;
				let endDate = startDate + 1000 * 60 * 60 * 24 * dateRange;
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users').get(employeeId);
				let user = await query.run(connection);
				query = r.db('work_genius').table('worklog').
					filter({author_id:employeeId}).filter(r.row('create_date').ge(startDate)
					.and(r.row('create_date').le(endDate)))
					.coerceTo('array');
				result = await query.run(connection);

				result.forEach(log => {
					log.author = user.name;
				});
				
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'getWorkLogList': {
		type: new GraphQLList(WorkLog_TYPE),
		description: 'Get all worklog of selected user',
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
				query = null,
			    result = [];

			try {
				dateRange = dateRange || 1;
				let endDate = startDate + 1000 * 60 * 60 * 24 * dateRange;
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('worklog').eqJoin('author_id',r.db('work_genius').table('users'))
  					.without({right:['email','id','location','nickname','privilege','timezone','title']}).zip()
					.filter(r.row('create_date').ge(startDate)
					.and(r.row('create_date').le(endDate)))
					.coerceTo('array');
				result = await query.run(connection);

				result.forEach(log => {
					log.author = log.name;
				});
				
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