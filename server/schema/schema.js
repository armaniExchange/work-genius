// GraphQL
import {
	GraphQLObjectType,
	GraphQLSchema
} from 'graphql';

// Query & Mutations
import TaskQuery from '../models/Task/TaskQuery.js';
import TaskMutation from '../models/Task/TaskMutation.js';
import UserQuery from '../models/User/UserQuery.js';
import UserMutation from '../models/User/UserMutation.js';

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			tasks: TaskQuery.tasks,
			isLogin: UserQuery.isLogin
		}
	}),
	mutation: new GraphQLObjectType({
		name: 'RootMutationType',
		fields: {
			editTaskEta: TaskMutation.editTaskEta,
			login: UserMutation.userLogin,
			logout: UserMutation.userLogout,
			initiateCrawler: TaskMutation.initiateCrawler,
			deleteInternalFeatures: TaskMutation.deleteInternalFeatures,
			createInternalFeatures: TaskMutation.createInternalFeatures
		}
	})
});

export default schema;
