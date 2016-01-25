// GraphQL types
import {
	GraphQLObjectType,
	GraphQLInt,
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
		},
		'total_percent': {
			type: GraphQLString,
			description: 'Feature completed percent: total'
		},
		'dev_percent': {
			type: GraphQLString,
			description: 'Feature completed percent: developer'
		},
		'qa_percent': {
			type: GraphQLString,
			description: 'Feature completed percent: QA'
		},
		'days_to_complete': {
			type: GraphQLInt,
			description: 'Days cost to develop the feature'
		},
		'completed_date': {
			type: GraphQLString,
			description: 'Completed date of the feature'
		},
		'owner_name': {
			type: GraphQLString,
			description: 'Feature owner name'
		},
		'dev_name': {
			type: GraphQLString,
			description: 'Feature developer name'
		},
		'qa_name': {
			type: GraphQLString,
			description: 'Feature QA name'
		},
		'dev_id': {
			type: GraphQLString,
			description: 'Feature developer id'
		},
	})
});

export default TaskType;
