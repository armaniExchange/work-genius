// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLBoolean
} from 'graphql';

let TaskType = new GraphQLObjectType({
	name: 'Task',
	description: 'A task object',
	fields: () => ({
		'id': {
			type: GraphQLID,
			description: 'Task ID'
		},
		'title': {
			type: GraphQLString,
			description: 'Task title'
		},
		'eta': {
			type: GraphQLString,
			description: 'Estimated time of completion'
		},
		'created': {
			type: GraphQLString,
			description: 'date when the task is created'
		},
		'pri': {
			type: GraphQLString,
			description: 'Task priority'
		},
		'severity': {
			type: GraphQLString,
			description: 'Task severity'
		},
		'status': {
			type: GraphQLString,
			description: 'Current task status'
		},
		'developer_email': {
			type: GraphQLString,
			description: 'Email of the developer responsible for this task'
		},
		'qa_email': {
			type: GraphQLString,
			description: 'Email of the QA responsible for this task'
		},
		'must_fix': {
			type: GraphQLBoolean,
			description: 'Developer responsible for this task'
		},
		'project': {
			type: GraphQLString,
			description: 'Project that this task belongs to'
		},
		'type': {
			type: GraphQLString,
			description: 'Task type'
		}
	})
});

export default TaskType;
