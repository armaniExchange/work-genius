// GraphQL types
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat
} from 'graphql';

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
    }
  })
});

export default TestReportCategorySetupType;
