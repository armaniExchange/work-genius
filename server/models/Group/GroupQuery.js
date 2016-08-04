import GroupType from './GroupType.js';
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

let GroupQuery = {
	'getAllGroups': {
		type: new GraphQLList(GroupType),
		description: 'Get all groups',
        args: {
			name: {
				type: GraphQLString,
				description: 'group name'
			},
			leader: {
				type: GraphQLString,
				description: 'group leader'
			}
		},
		resolve: async (root, { name , leader}) => {
			let connection = null,
			    result = [],
				query = null,
				filterFunc = group =>{
					let predicate = r.expr(true);
					if(name){
						predicate = predicate.and(group('name').match(name));
					}
					if(leader){
						predicate = predicate.and(group('leader').eq(leader));
					}
					return predicate;
				};

			try {
				//get all groups
				query = r.db('work_genius').table('groups').filter(filterFunc).coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let result = await query.run(connection);

				//set member info for all groups
				query = r.db('work_genius').table('users').hasFields('groups').coerceTo('array');
				let users = await query.run(connection);
				result.forEach(group => {
					let groupUsers = users.filter(user => {
						return user.groups.includes(group.id);
					});
					group.members = [];
					if(groupUsers){
						group.members = [...groupUsers];
					}
				});
				
				await connection.close();
				return result;
			} catch (err) {
				await connection.close();
				console.log(err);
			}
			return result;
		}
	}
};

export default GroupQuery;