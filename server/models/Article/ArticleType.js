// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
  GraphQLFloat,
	GraphQLID,
  GraphQLList
} from 'graphql';
import UserType from '../User/UserType';
import CommentType from '../Comment/CommentType';
import FileType from '../File/FileType';
import CategoryType from '../Category/CategoryType';

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  descriptyion: 'An documentation article',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Article ID'
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
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'Article\'s tags'
    },
    category: {
      type: CategoryType,
      description: 'Article\'s categories'
    },
    content: {
      type: GraphQLString,
      description: 'Article\'s content'
    },
    createdAt: {
      type: GraphQLFloat,
      description: 'Article\'s created time'
    },
    updatedAt: {
      type: GraphQLFloat ,
      description: 'Article\'s updated time'
    },
    title: {
      type: GraphQLString,
      description: 'Article\'s title'
    },
    comments: {
      type: new GraphQLList(CommentType),
      description: 'Comment List'
    },
    author: {
      type: UserType
    },
    files: {
      type: new GraphQLList(FileType),
      description: 'File List'
    }
  })
});

export default ArticleType;
