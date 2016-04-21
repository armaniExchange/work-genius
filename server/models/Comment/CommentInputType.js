// GraphQL types
import {
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLID
} from 'graphql';

import AuthorInputType from '../User/AuthorInputType';

const CommentInputType = new GraphQLInputObjectType({
  name: 'CommentInputType',
  descriptyion: 'A comment',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Comment ID'
    },
    author:{
      type: AuthorInputType
    },
    content: {
      type: GraphQLString,
      description: 'Comment\'s content'
    },
    // title: {
    //   type: GraphQLString,
    //   description: 'Comment\'s title'
    // }
  })
});

export default CommentInputType;
