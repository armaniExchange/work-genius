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

const TestReportCategoryType = new GraphQLObjectType({
  name: 'TestReportCategory',
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
    'articlesCount': {
      type: GraphQLInt,
      description: 'Category\'s article counts'
    },
    'subCategories': {
      type: new GraphQLList(TestReportCategoryType),
      description: 'Category\'s subcategory'
    },
    'path': {
      type: GraphQLString,
    },
    'axapis': {
      type: new GraphQLList(GraphQLString)
    },
    'axapiTest': {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'axapiTestType',
        fields: () => ({
          // id: { type: GraphQLID },
          // api: { type: GraphQLString},
          // createdAt: { type: GraphQLFloat},
          isSuccess: {type: GraphQLBoolean},
          errorMessage: {type: GraphQLString}
        })
      }))
    },
    'unitTest': {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'unitTestType',
        fields: () => ({
          // id: { type: GraphQLID },
          // api: { type: GraphQLString},
          // createdAt: { type: GraphQLFloat},
          isSuccess: {type: GraphQLBoolean},
          errorMessage: {type: GraphQLString}
        })
      }))
    },
    end2endTest: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'end2endTestType',
        fields: () => ({
          // id: { type: GraphQLID },
          // api: { type: GraphQLString},
          // createdAt: { type: GraphQLFloat},
          isSuccess: {type: GraphQLBoolean},
          errorMessage: {type: GraphQLString}
        })
      }))
    }
  })
});

export default TestReportCategoryType;
