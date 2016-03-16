// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLList
} from 'graphql';

const ARTICLE_TYPE = new GraphQLObjectType({
    name: 'Article',
    descriptyion: 'An documentation article',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'Article ID'
        },
        'author_id': {
            type: GraphQLID,
            description: 'Article\'s author ID'
        },
        'tags': {
            type: new GraphQLList(GraphQLString),
            description: 'Article\'s tags'
        },
        'categories_id': {
            type: new GraphQLList(GraphQLID),
            description: 'Article\'s categories'
        },
        'content': {
            type: GraphQLString,
            description: 'Article\'s content'
        },
        'files_id': {
            type: new GraphQLList(GraphQLID),
            description: 'Article\'s content'
        },
        'comments_id': {
            type: new GraphQLList(GraphQLID),
            description: 'Article\'s comments'
        },
        'created_at': {
            type: GraphQLString,
            description: 'Article\'s created time'
        },
        'updated_at': {
            type: GraphQLString,
            description: 'Article\'s updated time'
        },
        'title': {
            type: GraphQLString,
            description: 'Article\'s title'
        }
    })
});

export default ARTICLE_TYPE;
