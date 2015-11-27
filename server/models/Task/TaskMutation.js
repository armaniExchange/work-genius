// GraphQL
import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLID
} from 'graphql';
// Models
import TaskType from './TaskType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

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
	}
};

export default TaskMutation;
