// GraphQL types
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql';
import TestReportCategoryCheckItemType from './TestReportCategoryCheckItemType';

const TestReportCategorySetupType = new GraphQLObjectType({
  name: 'TestReportCategorySetup',
  descriptyion: 'A file',
  fields: () => ({
    'id': {
      type: GraphQLID,
      description: 'Category ID'
    },
    'parentId': {
      type: GraphQLID,
      description: 'Category\'s parent ID'
    },
    'name': {
      type: GraphQLString,
      description: 'Category\'s display name'
    },
    'subCategories': {
      type: new GraphQLList(TestReportCategorySetupType),
      description: 'Category\'s subcategory'
    },
    'path': {
      type: GraphQLString,
    },
    'axapis': {
      type: new GraphQLList(GraphQLString)
    },
    'owners': {
      type: new GraphQLList(GraphQLID)
    },
    'difficulty': {
      type: GraphQLInt
    },
    'docETA': {
      type: GraphQLFloat
    },
    'codeETA': {
      type: GraphQLFloat
    },
    'docStatus': {
      type: GraphQLString
    },
    'codeStatus': {
      type: GraphQLString
    },
    'UTDoc': {
      type: GraphQLString
    },
    'checkList': {
      type: new GraphQLList(TestReportCategoryCheckItemType)
    },
    'isCheckListDone': {
      type: GraphQLBoolean
    },
    'bugStatistic': {
      type: new GraphQLObjectType({
        name: 'bugStatisticType',
        fields: () => ({
          new: { type: GraphQLFloat},
          resolved: { type: GraphQLFloat},
          verified: { type: GraphQLFloat},
          reopened: { type: GraphQLFloat},
          total: { type: GraphQLFloat}
        })
      })
    },
  })
});

export default TestReportCategorySetupType;
