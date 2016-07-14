// GraphQL types
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql';

const TestReportCategoryType = new GraphQLObjectType({
  name: 'TestReportCategory',
  descriptyion: 'TestReportCategory',
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
    'owners': {
      type: new GraphQLList(GraphQLID)
    },
    'difficulty': {
      type: GraphQLInt
    },
    'axapiTest': {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'axapiTestType',
        fields: () => ({
          // id: { type: GraphQLID },
          createdAt: { type: GraphQLFloat},
          api: { type: GraphQLString},
          isSuccess: {type: GraphQLBoolean},
          errorMessage: {type: GraphQLString},
          framework: {type: GraphQLString}
        })
      }))
    },
    'unitTest': {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'unitTestType',
        fields: () => ({
          // id: { type: GraphQLID },
          createdAt: { type: GraphQLFloat},
          path: { type: GraphQLString},
          isSuccess: {type: GraphQLBoolean},
          errorMessage: {type: GraphQLString},
          framework: {type: GraphQLString}
        })
      }))
    },
    end2endTest: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'end2endTestType',
        fields: () => ({
          // id: { type: GraphQLID },
          createdAt: { type: GraphQLFloat},
          path: { type: GraphQLString},
          isSuccess: {type: GraphQLBoolean},
          errorMessage: {type: GraphQLString},
          framework: {type: GraphQLString}
        })
      }))
    }
  })
});

export default TestReportCategoryType;
