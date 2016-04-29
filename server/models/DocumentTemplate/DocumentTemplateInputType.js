// GraphQL types
import {
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLID
} from 'graphql';

const DocumentTemplateInputType = new GraphQLInputObjectType({
  name: 'DocumentTemplateInputType',
  descriptyion: 'A document type input',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'document template\'s id, use documentType'
    },
    content: {
      type: GraphQLString,
      description: 'document\'s template content'
    }
  })
});

export default DocumentTemplateInputType;
