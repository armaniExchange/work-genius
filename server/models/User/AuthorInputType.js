// GraphQL types
import {
	GraphQLInputObjectType,
	GraphQLString,
} from 'graphql';

let AuthorInputType = new GraphQLInputObjectType({
	name: 'AuthorInputType',
  fields: {
    'id': {
      type: GraphQLString,
      description: 'Author ID'
    },
  }
});

export default AuthorInputType;
