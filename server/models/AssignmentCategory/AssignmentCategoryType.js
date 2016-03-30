// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList
} from 'graphql';

const ASSIGNMENT_CATEGORY_TYPE = new GraphQLObjectType({
    name: 'AssignmentCategory',
    descriptyion: 'An assignment Category',
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
		'subCategories': {
			type: new GraphQLList(ASSIGNMENT_CATEGORY_TYPE),
			description: 'Category\'s subcategory'
		},
		'path': {
			type: GraphQLString,
            description: 'Category\'s path'
		}
    })
});

export default ASSIGNMENT_CATEGORY_TYPE;
