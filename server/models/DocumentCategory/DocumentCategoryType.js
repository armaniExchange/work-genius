// GraphQL types
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';

const DOCUMENT_CATEGORY_TYPE = new GraphQLObjectType({
    name: 'DocumentCategory',
    description: 'A document category',
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
        type: new GraphQLList(DOCUMENT_CATEGORY_TYPE),
        description: 'Category\'s subcategory'
      },
      'isFeature' : {
        type: GraphQLBoolean,
        description: 'Category is a feature, for automation usage'
      },
      'production': {
        type: GraphQLString,
        description: 'Category\'s production name'
      }
    })
});

export default DOCUMENT_CATEGORY_TYPE;
