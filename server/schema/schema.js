// GraphQL
import {
	GraphQLObjectType,
	GraphQLSchema
} from 'graphql';

// Query & Mutations
import TaskQuery from '../models/Task/TaskQuery.js';
import TaskMutation from '../models/Task/TaskMutation.js';

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			tasks: TaskQuery.tasks
		}
	}),
	mutation: new GraphQLObjectType({
		name: 'RootMutationType',
		fields: {
			editTaskEta: TaskMutation.editTaskEta
		}
	})
});

export default schema;
