// GraphQL
import {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';
// Models
import BUG_TYPE from './BugType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugQuery = {
	'getAllBugs': {
		type: new GraphQLList(BUG_TYPE),
		description: 'Get all bugs',
        args: {
			label: {
				type: GraphQLString,
				description: 'project'
			},
			assignedTo: {
				type: GraphQLString,
				description: 'assigned To'
			},
			menu: {
				type: GraphQLString,
				description: 'belong to menu'
			},
			rootCause: {
				type: GraphQLString,
				description: 'root cause'
			},
			preventTag: {
				type: GraphQLString,
				description: 'prevent Tag'
			},
			introduced_by:{
				type: GraphQLString,
				description: 'bug introduced by'
			},
			pageSize: {
				type: GraphQLInt,
				description: 'page size'
			},
			pageIndex: {
				type: GraphQLInt,
				description: 'page index'
			}
		},
		resolve: async (root, { label, assignedTo,menu,rootCause,preventTag,introduced_by, pageSize, pageIndex }) => {
			let connection = null,
			    result = null,
                filter = {},
				query = null;
			let menuFilter = (bug) => {
				if(menu){
					return bug('menu').contains(menu);
				}else{
					return true;
				}
			},
			tagFilter = (bug) => {
				if(preventTag){
					return bug('tags').contains(preventTag);
				}else{
					return true;
				}
			};

			try {
				console.log('label:' + label);
				console.log('assignedTo:' + assignedTo);
				console.log('menu:'+ menu) ;
				console.log('rootCause:'+ rootCause) ;
				console.log('preventTag:'+ preventTag) ;
				console.log('page size:' + pageSize);
				console.log('page index:' + pageIndex);
				if(label){
					filter.label = label;
				}
				if(assignedTo){
					filter.assigned_to = assignedTo;
				}
				if(rootCause){
					filter.resolved_type = rootCause;
				}

				//get total row
				query = r.db('work_genius').table('bugs_review').filter(filter).filter(menuFilter).filter(tagFilter).count();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let totalRow = await query.run(connection); 

				if(!!pageSize){
					query = r.db('work_genius').table('bugs_review').filter(filter).filter(menuFilter).filter(tagFilter)
							.orderBy(r.desc('id')).skip((pageIndex - 1) * pageSize).limit(pageSize).coerceTo('array');
				}else{
					query = r.db('work_genius').table('bugs_review').filter(filter).filter(menuFilter).filter(tagFilter)
					.orderBy(r.desc('id')).coerceTo('array');
				}
				result = await query.run(connection); 
				for(let bug of result){
					bug.total_row = totalRow;
				}
				console.log('result:');
				console.log(totalRow);             
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default BugQuery;