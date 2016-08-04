// GraphQL types
import {
  GraphQLInputObjectType,
	GraphQLString,
	GraphQLID,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import AuthorInputType from '../User/AuthorInputType';
import CommentInputType from '../Comment/CommentInputType';

const ArticleInputType = new GraphQLInputObjectType({
  name: 'ArticleInputType',
  descriptyion: 'An documentation article',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Article ID'
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'Article\'s tags'
    },
    categoryId: {
      type: GraphQLString,
      description: 'Article\'s categories'
    },
    content: {
      type: GraphQLString,
      description: 'Article\'s content'
    },
    title: {
      type: GraphQLString,
      description: 'Article\'s title'
    },
    comments: {
      type: new GraphQLList(CommentInputType),
      description: 'Comment List'
    },
    author:{ type: AuthorInputType },
    files:{
      type: new GraphQLList(new GraphQLInputObjectType({
        name: 'FileInputType',
        fields: {
          'id': {
            type: GraphQLString,
            description: 'File ID'
          }
        }
      })),
      description: 'File List'
    },
    documentType: {
      type: GraphQLString,
      description: 'Article\'s document type'
    },
    priority: {
      type: GraphQLString,
      description: 'Article\'s priority'
    },
    milestone: {
      type: GraphQLString,
      description: 'Article\'s milestone'
    },
    reportTo: {
      type: new GraphQLList(GraphQLString),
      description: 'Article\'s report to'
    },
    updateTestReportUt: { type: GraphQLBoolean}
  })
});

export default ArticleInputType;
