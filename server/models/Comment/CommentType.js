// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
  GraphQLFloat,
	GraphQLID
} from 'graphql';
import UserType from '../User/UserType.js';

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  descriptyion: 'A comment',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Comment ID'
    },
    author: {
      type: UserType,
      description: 'Comment\'s author'
    },
    content: {
      type: GraphQLString,
      description: 'Comment\'s content'
    },
    createdAt: {
      type: GraphQLFloat,
      description: 'Comment\'s created time'
    },
    updatedAt: {
      type: GraphQLFloat,
      description: 'Comment\'s updated time'
    },
    title: {
      type: GraphQLString,
      description: 'Comment\'s title'
    }
  })
});

export default CommentType;
