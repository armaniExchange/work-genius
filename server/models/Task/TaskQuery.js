// GraphQL
import {
	GraphQLList,
	GraphQLString
} from 'graphql';
// Models
import TaskType from './TaskType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT, ADMIN_ID } from '../../constants/configurations.js';

let TaskQuery = {
	'tasks': {
		type: new GraphQLList(TaskType),
		description: 'Get all tasks from GK2',
		args: {
			devId: {
				type: GraphQLString,
				description: 'Specify which dev\'s task to fetch'
			},
			taskType: {
				type: GraphQLString,
				description: 'Specify which task type to fetch'
			}
		},
		resolve: async (root, { taskType, devId }) => {
			let connection = null,
			    result = null,
			    filterCondition = {},
			   //  query = r.db('work_genius').table('tasks')
			   //      .eqJoin('developer_id', r.db('work_genius').table('users'))
				  //   .map((data) => ({
				  //   	'task_id'     : data('left')('id'),
				  //   	'developer'   : data('right')('name'),
						// 'title'       : data('left')('title'),
						// 'pri'         : data('left')('pri'),
						// 'status'      : data('left')('status'),
						// 'dev_progress': data('left')('dev_progress'),
						// 'qa_progress' : data('left')('qa_progress'),
						// 'qa'          : data('left')('qa'),
						// 'project'     : data('left')('project'),
						// 'eta'         : data('left')('eta'),
						// 'type'        : data('left')('type')
				  //   }))
				  //   .filter(filterCondition)
				  //   .coerceTo('array');
				query = null;

			try {
				if (taskType) {
					filterCondition['type'] = taskType;
				}
				if (devId && devId !== ADMIN_ID) {
					filterCondition['dev_id'] = devId;
				}
				query = r.db('work_genius').table('tasks').filter(filterCondition).coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default TaskQuery;
