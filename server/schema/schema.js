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
import PTOMutation from '../models/PTO/PTOMutation.js';

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
			login: UserMutation.userLogin,
			logout: UserMutation.userLogout,
			// Task Page
			initiateCrawler: TaskMutation.initiateCrawler,
			editTaskEta: TaskMutation.editTaskEta,
			deleteInternalFeatures: TaskMutation.deleteInternalFeatures,
			createInternalFeatures: TaskMutation.createInternalFeatures,
			updateInternalFeatures: TaskMutation.updateInternalFeatures,
			// PTO Page
			createPTOApplication: PTOMutation.createPTOApplication
		}
	})
});

export default schema;
