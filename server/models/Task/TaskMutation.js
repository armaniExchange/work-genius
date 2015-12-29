// GraphQL
import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLList
} from 'graphql';
// Models
import TaskType from './TaskType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
// Crawler
import { crawlGK2 } from '../../crawler/crawler.js';

let TaskMutation = {
	'editTaskEta': {
		type: TaskType,
		description: 'Edit task eta',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLID),
				description: 'Target task id'
			},
			eta: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'New eta to update'
			}
		},
		resolve: async (root, { id, eta }) => {
			let connection = null,
				mutationResult = null,
				queryResult = null,
				mutationQuery = r.db('work_genius').table('tasks').get(id).update({
					eta: eta
				}),
				// query = r.db('work_genius').table('tasks')
			 //        .eqJoin('developer_id', r.db('work_genius').table('users'))
				//     .map((data) => ({
				//     	'task_id'     : data('left')('id'),
				//     	'developer'   : data('right')('name'),
				// 		'title'       : data('left')('title'),
				// 		'pri'         : data('left')('pri'),
				// 		'status'      : data('left')('status'),
				// 		'dev_progress': data('left')('dev_progress'),
				// 		'qa_progress' : data('left')('qa_progress'),
				// 		'qa'          : data('left')('qa'),
				// 		'project'     : data('left')('project'),
				// 		'eta'         : data('left')('eta')
				//     }))
				//     .filter((task) => task('task_id').eq(id))
				//     .coerceTo('array');
				query = r.db('work_genius').table('tasks')
				    .filter((task) => task('id').eq(id))
				    .coerceTo('array');

			try {
				if (!/^(\d{4}-\d{2}-\d{2})?$/gi.test(eta)) {
					throw new Error('Wrong ETA date format');
				}
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationResult = await mutationQuery.run(connection);
				if (mutationResult.skipped) {
					throw new Error('Task ID not Found!');
				} else if (mutationResult.errors) {
					throw new Error(mutationResult.first_error);
				}
				queryResult = await query.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return queryResult[0];
		}
	},
	'initiateCrawler': {
		type: GraphQLString,
		description: 'Initiate crawler to crawl features and GK2',
		resolve: async () => {
			try {
				await crawlGK2();
				return 'Crawl GK2 Success';
			} catch (err) {
				return err;
			}
		}
	},
	'deleteInternalFeatures': {
		type: GraphQLString,
		description: 'Delete internal features',
		args: {
			ids: {
				type: new GraphQLList(GraphQLString),
				description: 'IDs to be deleted'
			}
		},
		resolve: async (root, { ids }) => {
			let connection = null,
				mutationResult = null,
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				for (var i = 0; i < ids.length; i++) {
					mutationQuery = r.db('work_genius').table('tasks').get(ids[i]).delete();
					mutationResult = await mutationQuery.run(connection);
					if (mutationResult.skipped) {
						throw new Error('Task ID not Found!');
					} else if (mutationResult.errors) {
						throw new Error(mutationResult.first_error);
					}
				}
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Delete successfully!';
		}
	},
	'createInternalFeatures': {
		type: GraphQLString,
		description: 'Create new internal features',
		args: {
			data: {
				type: GraphQLString,
				description: 'new internal feature data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('tasks').insert(JSON.parse(data));
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Create successfully!';
		}
	}
};

export default TaskMutation;
