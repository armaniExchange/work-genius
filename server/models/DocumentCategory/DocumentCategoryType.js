// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt
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
    })
});

export default DOCUMENT_CATEGORY_TYPE;
