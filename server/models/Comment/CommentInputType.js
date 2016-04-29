// GraphQL types
import {
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLID
} from 'graphql';

const CommentInputType = new GraphQLInputObjectType({
  name: 'CommentInputType',
  descriptyion: 'A comment',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Comment ID'
    },
    content: {
      type: GraphQLString,
      description: 'Comment\'s content'
    }
  })
});

export default CommentInputType;
