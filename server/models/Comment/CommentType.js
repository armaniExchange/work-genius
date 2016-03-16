// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLList
} from 'graphql';

const COMMENT_TYPE = new GraphQLObjectType({
    name: 'Comment',
    descriptyion: 'A comment',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'Comment ID'
        },
        'author_id': {
            type: GraphQLID,
            description: 'Comment\'s author ID'
        },
        'content': {
            type: GraphQLString,
            description: 'Comment\'s content'
        },
        'created_at': {
            type: GraphQLString,
            description: 'Comment\'s created time'
        },
        'updated_at': {
            type: GraphQLString,
            description: 'Comment\'s updated time'
        },
        'title': {
            type: GraphQLString,
            description: 'Comment\'s title'
        }
    })
});

export default COMMENT_TYPE;
