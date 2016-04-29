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
import MailMutation from '../models/EMail/EMailMutation.js';
import JobMutation from '../models/Job/JobMutation.js';
import JobQuery from '../models/Job/JobQuery.js';
import DocumentCategoryQuery from '../models/DocumentCategory/DocumentCategoryQuery.js';
import DocumentCategoryMutation from '../models/DocumentCategory/DocumentCategoryMutation.js';
import DocumentTemplateQuery from '../models/DocumentTemplate/DocumentTemplateQuery.js';
import DocumentTemplateMutation from '../models/DocumentTemplate/DocumentTemplateMutation.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      // PTO Page
      allUserWithPto           : UserQuery.allUserWithPto,
      allUserWithOvertime      : UserQuery.allUserWithOvertime,
      ptoApplications          : PTOQuery.ptoApplications,
      overtimeApplications     : PTOQuery.overtimeApplications,
      // Task Page
      allUserWithTasks         : UserQuery.allUserWithTasks,
      tasks                    : TaskQuery.tasks,
      // User page
      allUserWithPrivilege     : UserQuery.allUserWithPrivilege,
      currentUser              : UserQuery.currentUser,
      allUsers                 : UserQuery.allUsers,
      // Document page
      allCategories            : CategoryQuery.getAllCategories,
      getAllMilestones         : CategoryQuery.getAllMilestones,
      categoryTree             : CategoryQuery.getCategoryTree,
      commentById              : CommentQuery.getCommentById,
      tags                     : CategoryQuery.getAllTags,
      getArticle               : ArticleQuery.getArticle,
      getAllArticles           : ArticleQuery.getAllArticles,
      getAllBugs               : BugQuery.getAllBugs,
      getAllBugTags            : BugTagQuery.getAllBugTags,
      getAllRelease            : BugTagQuery.getAllRelease,
      getAllWorklogTags		     : BugTagQuery.getAllWorklogTags,
      getAllDocumentCategories : DocumentCategoryQuery.getAllDocumentCategories,
      getDcoumentTemplate      : DocumentTemplateQuery.getDcoumentTemplate,
      // Feature Analysis
      assignmentCategoryTree   : AssignmentCategoryQuery.getAssignmentCategoryTree,
      allAssignmentCategories  : AssignmentCategoryQuery.getAllAssignmentCategories,
      tags                     : AssignmentCategoryQuery.getAllTags,
      allDifficulties          : AssignmentCategoryQuery.getAllDifficulties,
      getRootCauseSummary      : BugStats.getRootCauseSummary,
      getOwnerSummary          : BugStats.getOwnerSummary,
      getTagSummary            : BugStats.getBugSummary,
      getOwnerRootCauseSummary : BugStats.getOwnerRootCauseSummary,
      //worklog
      getWorkLogByEmployeeId   : WorkLogQuery.getWorkLogByEmployeeId,
      //job
      getJobList               : JobQuery.getJobList,
      getJobByEmployeeId       : JobQuery.getJobByEmployeeId
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      // Mail APIs
      sendMail                        : MailMutation.sendMail,
      sendMailIncludingManagers       : MailMutation.sendMailIncludingManagers,
      // Task Page
      initiateCrawler                 : TaskMutation.initiateCrawler,
      editTaskEta                     : TaskMutation.editTaskEta,
      deleteInternalFeatures          : TaskMutation.deleteInternalFeatures,
      createInternalFeatures          : TaskMutation.createInternalFeatures,
      updateInternalFeatures          : TaskMutation.updateInternalFeatures,
      // PTO Page
      createPTOApplication            : PTOMutation.createPTOApplication,
      deletePTOApplication            : PTOMutation.deletePTOApplication,
      updatePTOApplicationStatus      : PTOMutation.updatePTOApplicationStatus,
      createOvertimeApplication       : PTOMutation.createOvertimeApplication,
      updateOvertimeApplicationStatus : PTOMutation.updateOvertimeApplicationStatus,
      createPTOAndRefreshJob          : PTOMutation.createPTOAndRefreshJob,
      updatePTOStatusAndRefreshJob    : PTOMutation.updatePTOStatusAndRefreshJob,
      // User page
      updateUserPrivilege             : UserMutation.updateUserPrivilege,
      // Document page
      createComment                   : CommentMutation.createComment,
      deleteComment                   : CommentMutation.deleteComment,
      updateComment                   : CommentMutation.updateComment,
      createArticle                   : ArticleMutation.createArticle,
      updateArticle                   : ArticleMutation.updateArticle,
      deleteArticle                   : ArticleMutation.deleteArticle,
      updateAssignmentCategory        : AssignmentCategoryMutation.updateAssignmentCategory,
      upsertDocumentCategory          : DocumentCategoryMutation.upsertDocumentCategory,
      deleteDocumentCategory          : DocumentCategoryMutation.deleteDocumentCategory,
      updateDocumentTemplate          : DocumentTemplateMutation.updateDocumentTemplate,
      //Bug page
      updateBug                       : BugMutation.updateBug,
      createBugTag                    : BugTagMutation.createBugTag,
      createRelease                   : BugTagMutation.createRelease,
      createWorklogTag				  : BugTagMutation.createWorklogTag,
      //work log page
      createWorkLog                   : WorkLogMutation.createWorkLog,
      updateWorkLog                   : WorkLogMutation.updateWorkLog,
      deleteWorkLog                   : WorkLogMutation.deleteWorkLog,
      //job page
      createJobAndWorkLog             : JobMutation.createJobAndWorkLog,
      updateJobAndWorkLog             : JobMutation.updateJobAndWorkLog,
      deleteJob                       : JobMutation.deleteJob

    }
  })
});

export default schema;
