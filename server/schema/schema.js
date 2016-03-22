// GraphQL
import {
	GraphQLObjectType,
	GraphQLSchema
} from 'graphql';

// Query & Mutations
import TaskQuery from '../models/Task/TaskQuery.js';
import TaskMutation from '../models/Task/TaskMutation.js';
import UserQuery from '../models/User/UserQuery.js';
import PTOQuery from '../models/PTO/PTOQuery.js';
import PTOMutation from '../models/PTO/PTOMutation.js';
import UserMutation from '../models/User/UserMutation.js';
import CategoryQuery from '../models/Category/CategoryQuery.js';
import CommentQuery from '../models/Comment/CommentQuery.js';
import CommentMutation from '../models/Comment/CommentMutation.js';

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			// PTO Page
			allUserWithPto      : UserQuery.allUserWithPto,
			ptoApplications     : PTOQuery.ptoApplications,
			// Task Page
			allUserWithTasks    : UserQuery.allUserWithTasks,
			tasks               : TaskQuery.tasks,
			// User page
			allUserWithPrivilege: UserQuery.allUserWithPrivilege,
			currentUser         : UserQuery.currentUser,
			// Document page
			allCategories       : CategoryQuery.getAllCategories,
			categoryTree        : CategoryQuery.getCategoryTree,
			commentById         : CommentQuery.getCommentById,
			tags          : CategoryQuery.getAllTags
		}
	}),
	mutation: new GraphQLObjectType({
		name: 'RootMutationType',
		fields: {
			// Task Page
			initiateCrawler           : TaskMutation.initiateCrawler,
			editTaskEta               : TaskMutation.editTaskEta,
			deleteInternalFeatures    : TaskMutation.deleteInternalFeatures,
			createInternalFeatures    : TaskMutation.createInternalFeatures,
			updateInternalFeatures    : TaskMutation.updateInternalFeatures,
			// PTO Page
			createPTOApplication      : PTOMutation.createPTOApplication,
			deletePTOApplication      : PTOMutation.deletePTOApplication,
			updatePTOApplicationStatus: PTOMutation.updatePTOApplicationStatus,
			// User page
			updateUserPrivilege       : UserMutation.updateUserPrivilege,
			// Document page
			createComment             : CommentMutation.createComment,
			deleteComment             : CommentMutation.deleteCommentById
		}
	})
});

export default schema;
