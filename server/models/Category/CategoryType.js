// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLInt,
	GraphQLList
} from 'graphql';

const ARTICLE_TYPE = new GraphQLObjectType({
    name: 'Category',
    descriptyion: 'An documentation article',
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
            description: 'Category\'s tags'
        },
        'articlesCount': {
            type: GraphQLInt,
            description: 'Category\'s articles count'
        },
		'subCategories': {
			type: new GraphQLList(ARTICLE_TYPE),
			description: 'Category\'s subcategory'
		},
		'path': {
			type: GraphQLString,
            description: 'Category\'s path'
		}
    })
});

export default ARTICLE_TYPE;
