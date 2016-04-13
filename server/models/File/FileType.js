// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
  GraphQLFloat,
	GraphQLID
} from 'graphql';

const FileType = new GraphQLObjectType({
  name: 'File',
  descriptyion: 'A file',
  fields: () => ({
    'id': {
      type: GraphQLID,
      description: 'File ID'
    },
    'name': {
      type: GraphQLString,
      description: 'File\'s name'
    },
    'createdAt': {
      type: GraphQLFloat,
      description: 'File\'s created time'
    },
    'type': {
      type: GraphQLString,
      description: 'File\'s content type'
    },
    'url': {
      type: GraphQLString,
      description: 'File url'
    }
  })
});

export default FileType;
