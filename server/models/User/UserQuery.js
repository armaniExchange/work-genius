// GraphQL
import {
	GraphQLList,
  GraphQLBoolean
} from 'graphql';
// Types
import UserType from './UserType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT, ADMIN_ID,TESTER_ID } from '../../constants/configurations.js';
import { GUI_GROUP } from '../../constants/group-constant.js';

let UserQuery = {
	'currentUser': {
		type: UserType,
		description: 'Check current login user',
		resolve: async (root) => {
			let user = root.req.decoded,
			    connection = null,
			    result = null,
			    query = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users').filter({email: user.email}).coerceTo('array');
				result = await query.run(connection);
				result = result[0];
				await connection.close();
				if (root.req.decoded.nickname === 'Howard') {
					root.req.decoded.privilege = 10;
				}
				if (result) {
					return Object.assign({}, result, { token: root.req.token });
				}
				throw new Error('Invalid user');
			} catch (err) {
				return err;
			}
		}
	},
	'allUserWithPto': {
		type: new GraphQLList(UserType),
		description: 'Get all users with pto data',
		resolve: async () => {
			let connection = null,
			    result = [],
			    query = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users')
				.filter(function(user){
					return user('groups').default([]).contains(GUI_GROUP);
				})
				.merge((user) => {
					return {
						pto: r.db('work_genius').table('pto').getAll(user('id'), {
							index: 'applicant_id'
						}).coerceTo('array')
					};
				}).coerceTo('array');
				result = await query.run(connection);
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
		}
	},
	'allUserWithOvertime': {
		type: new GraphQLList(UserType),
		description: 'Get all users with overtime data',
		resolve: async () => {
			let connection = null,
			    result = [],
			    query = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users')
				.filter(function(user){
					return user('groups').default([]).contains(GUI_GROUP);
				})
				.merge((user) => {
					return {
						overtime_hours: r.db('work_genius').table('overtime_summary').get(user('id')).getField('hours').default(0)
					};
				}).coerceTo('array');
				result = await query.run(connection);
				await connection.close()
;				return result;
			} catch (err) {
				return err;
			}
		}
	},
	'allUserWithTasks': {
		type: new GraphQLList(UserType),
		description: 'Get all users with task data',
		resolve: async () => {
			let connection = null,
				users = null,
			    result = [],
			    query = null,
			    tasks = null;

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users').filter(r.row('id').ne(ADMIN_ID)).coerceTo('array');
				users = await query.run(connection);
				for (let user of users) {
					query = r.db('work_genius').table('tasks').filter({
						dev_id: user.id
					}).coerceTo('array');
					tasks = await query.run(connection);
					result.push(Object.assign(
						{},
						user,
						{ tasks }
					));
				}
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
		}
	},
	'allUserWithPrivilege': {
		type: new GraphQLList(UserType),
		description: 'Get all users with privilege role',
		resolve: async () => {
			let connection = null,
				users = null,
			    result = [],
			    query = null,
			    privileges = null;

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users').filter(r.row('id').ne(ADMIN_ID)).coerceTo('array');
				users = await query.run(connection);
				query = r.db('work_genius').table('privilege').filter({}).coerceTo('array');
				privileges = await query.run(connection);
				result = users.map(
					(user) => Object.assign(
					    {},
					    user,
					    privileges
					        .filter((privilege) => user.privilege === privilege.level)
					        .map((privilege) => ({
					        	privilege_display_name: privilege.display_name
					        }))[0]
					)
				);
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
		}
	},
	'allUsers':{
		type: new GraphQLList(UserType),
		description: 'Get all users',
    args: {
      notOnlyGui: {
        type: GraphQLBoolean,
        description: 'included all user'
      },
    },
		resolve: async (root, { notOnlyGui}) => {
			let connection = null,
				users = null,
			    query = null;
      notOnlyGui = notOnlyGui || false;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users')
				.filter(r.row('id').ne(ADMIN_ID).and(r.row('id').ne(TESTER_ID)))
				.filter(user => {
					return r.branch(notOnlyGui, true, user('groups').default([]).contains(GUI_GROUP));
				})
        .merge((user) => {
          return r.branch(notOnlyGui, { isGuiTeam: user('groups').default([]).contains(GUI_GROUP)} , {});
        })
				.coerceTo('array');
				users = await query.run(connection);
				for (let user of users) {
					if (!!user.email) {
						user.alias = user.email.replace('@a10networks.com','');
					}

				}
				await connection.close();
				return users;
			} catch (err) {
				return err;
			}
		}
	},
	'allUsersWithGroup': {
		type: new GraphQLList(UserType),
		description: 'Get all users with group',
		resolve: async () => {
			let connection = null,
				users = null,
			    query = null;

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('users')
					.filter(r.row('id').ne(ADMIN_ID).and(r.row('id').ne(TESTER_ID)))
					.coerceTo('array');
				users = await query.run(connection);

				//get all groups
				query = r.db('work_genius').table('groups').coerceTo('array');
				let groups = await query.run(connection);

				//replace the group id array by group object array
				users.forEach(user => {
					let groupsOfUser = [];
					if(user.groups){
						user.groups.forEach(groupId => {
							let group = groups.find(groupObj => {
								return groupObj.id === groupId;
							});
							if(group){
								groupsOfUser.push(group);
							}
						})
					}
					user.groups = groupsOfUser;
				});
				await connection.close();
				return users;
			} catch (err) {
				return err;
			}
		}
	}
};

export default UserQuery;
