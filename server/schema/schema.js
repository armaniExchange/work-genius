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
import ArticleQuery from '../models/Article/ArticleQuery.js';
import ArticleMutation from '../models/Article/ArticleMutation.js';
import BugQuery from '../models/Bug/BugQuery.js';
import BugMutation from '../models/Bug/BugMutation.js';
import BugTagQuery from '../models/BugTag/BugTagQuery.js';
import BugTagMutation from '../models/BugTag/BugTagMutation.js';
import AssignmentCategoryQuery from '../models/AssignmentCategory/AssignmentCategoryQuery.js';
import AssignmentCategoryMutation from '../models/AssignmentCategory/AssignmentCategoryMutation.js';

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			// PTO Page
			allUserWithPto         : UserQuery.allUserWithPto,
			ptoApplications        : PTOQuery.ptoApplications,
			// Task Page
			allUserWithTasks       : UserQuery.allUserWithTasks,
			tasks                  : TaskQuery.tasks,
			// User page
			allUserWithPrivilege   : UserQuery.allUserWithPrivilege,
			currentUser            : UserQuery.currentUser,
			allUsers 			   : UserQuery.allUsers,
			// Document page
			allCategories          : CategoryQuery.getAllCategories,
			categoryTree           : CategoryQuery.getCategoryTree,
			commentById            : CommentQuery.getCommentById,
			tags          		   : CategoryQuery.getAllTags,
			getArticle 			   : ArticleQuery.getArticle,
			getAllArticles 		   : ArticleQuery.getAllArticles,
			getAllBugs			   : BugQuery.getAllBugs,
			getAllBugTags	  	   : BugTagQuery.getAllBugTags,
			// Feature Analysis
			assignmentCategoryTree : AssignmentCategoryQuery.getAssignmentCategoryTree,
			allAssignmentCategories: AssignmentCategoryQuery.getAllAssignmentCategories,
			tags          		   : AssignmentCategoryQuery.getAllTags,
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
			deleteComment             : CommentMutation.deleteCommentById,
			createArticle			  : ArticleMutation.createArticle,
			editArticle			  	  : ArticleMutation.editArticle,
			deleteArticle			  : ArticleMutation.deleteArticle,
      updateAssignmentCategory: AssignmentCategoryMutation.updateAssignmentCategory,
			//Bug page
			updateBug				  : BugMutation.updateBug,
			createBugTag			  : BugTagMutation.createBugTag
		}
	})
});

export default schema;
