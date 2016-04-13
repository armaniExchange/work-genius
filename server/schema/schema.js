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
import BugStats from '../models/Bug/BugStats.js';
import WorkLogMutation from '../models/WorkLog/WorkLogMutation.js';
import WorkLogQuery from '../models/WorkLog/WorkLogQuery.js';

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			// PTO Page
			allUserWithPto         : UserQuery.allUserWithPto,
			ptoApplications        : PTOQuery.ptoApplications,
			overtimeApplications   : PTOQuery.overtimeApplications,
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
			allDifficulties        : AssignmentCategoryQuery.getAllDifficulties,
			getRootCauseSummary	   : BugStats.getRootCauseSummary,
			getOwnerSummary		   : BugStats.getOwnerSummary,
			getTagSummary		   : BugStats.getBugSummary,
			getOwnerRootCauseSummary	   : BugStats.getOwnerRootCauseSummary,
			//worklog
			getWorkLogList		   : WorkLogQuery.getWorkLogList
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
			createOvertimeApplication : PTOMutation.createOvertimeApplication,
			updateOvertimeApplicationStatus: PTOMutation.updateOvertimeApplicationStatus,
			// User page
			updateUserPrivilege       : UserMutation.updateUserPrivilege,
			// Document page
			createComment             : CommentMutation.createComment,
			deleteComment             : CommentMutation.deleteCommentById,
			createArticle			  : ArticleMutation.createArticle,
			updateArticle			  : ArticleMutation.updateArticle,
			deleteArticle			  : ArticleMutation.deleteArticle,
      updateAssignmentCategory: AssignmentCategoryMutation.updateAssignmentCategory,
			//Bug page
			updateBug				  : BugMutation.updateBug,
			createBugTag			  : BugTagMutation.createBugTag,
			//work log page
			createWorkLog			  : WorkLogMutation.createWorkLog,
			updateWorkLog			  : WorkLogMutation.updateWorkLog
		}
	})
});

export default schema;
