// GraphQL
import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt
} from 'graphql';
// Models
import TaskType from './TaskType.js';
// Fake data (TODO: DELETE FAKE DATA WHEN REAL DATA ARE READY!)
import { FAKE_TASK_DATA } from '../../fake-data.js';

let TaskMutation = {
	'editTaskEta': {
		type: TaskType,
		description: 'Edit task eta',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Target task id'
			},
			eta: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'New eta to update'
			}
		},
		resolve: (root, { id, eta }) => {
			FAKE_TASK_DATA.forEach((task) => {
				if (task._id === id) {
					task.eta = eta;
				}
			});
			return FAKE_TASK_DATA.filter((task) => task._id === id)[0];
		}
	}
};

export default TaskMutation;
