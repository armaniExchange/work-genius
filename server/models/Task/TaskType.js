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
		'developer_email': {
			type: GraphQLString,
			description: 'Email of the developer responsible for this task'
		},
		'title': {
			type: GraphQLString,
			description: 'Task title'
		},
		'pri': {
			type: GraphQLString,
			description: 'Task pri'
		},
		'status': {
			type: GraphQLString,
			description: 'Current task status'
		},
		'must_fix': {
			type: GraphQLBoolean,
			description: 'Developer responsible for this task'
		},
		'qa_email': {
			type: GraphQLString,
			description: 'Email of the QA responsible for this task'
		},
		'project': {
			type: GraphQLString,
			description: 'Project that this task belongs to'
		},
		'eta': {
			type: GraphQLString,
			description: 'Estimated time of completion'
		},
		'type': {
			type: GraphQLString,
			description: 'Task type'
		},
		'severity': {
			type: GraphQLString,
			description: 'Task severity'
		}
	})
});

export default TaskType;
