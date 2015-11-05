// GraphQL
import {
	GraphQLList
} from 'graphql';
// Models
import TaskType from './TaskType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let TaskQuery = {
	'tasks': {
		type: new GraphQLList(TaskType),
		description: 'Get all tasks from GK2',
		resolve: async () => {
			let connection = null,
			    result = null,
			    query = r.db('work_genius').table('tasks')
			        .eqJoin('developer_id', r.db('work_genius').table('users'))
				    .map((data) => ({
				    	'developer'   : data('right')('name'),
						'title'       : data('left')('title'),
						'pri'         : data('left')('pri'),
						'status'      : data('left')('status'),
						'dev_progress': data('left')('dev_progress'),
						'qa_progress' : data('left')('qa_progress'),
						'qa'          : data('left')('qa'),
						'project'     : data('left')('project'),
						'eta'         : data('left')('eta')
				    }))
				    .coerceTo('array');

			try {
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
