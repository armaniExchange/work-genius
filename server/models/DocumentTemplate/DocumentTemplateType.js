// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
  GraphQLFloat,
  GraphQLID
} from 'graphql';
import UserType from '../User/UserType.js';

const DocumentTemplateType = new GraphQLObjectType({
  name: 'DocumentTemplateType',
  descriptyion: 'A document type',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'document template\'s id, documentType'
    },
    author: {
      type: UserType,
      description: 'document template\'s author'
    },
    content: {
      type: GraphQLString,
      description: 'document\'s template content'
    },
    updatedAt: {
      type: GraphQLFloat,
      description: 'document\'s template updated time'
    },
  })
});

export default DocumentTemplateType;
