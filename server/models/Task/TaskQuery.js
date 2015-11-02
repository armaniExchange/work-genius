// GraphQL
import {
	GraphQLList
} from 'graphql';
// Models
import TaskType from './TaskType.js';
// Fake data (TODO: DELETE FAKE DATA WHEN REAL DATA ARE READY!)
import { FAKE_TASK_DATA } from '../../fake-data.js';

let TaskQuery = {
	'tasks': {
		type: new GraphQLList(TaskType),
		description: 'Get all tasks from GK2',
		resolve: () => {
			return FAKE_TASK_DATA;
		}
	}
};

export default TaskQuery;
