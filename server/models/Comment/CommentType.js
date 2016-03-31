// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID
} from 'graphql';
import UserType from '../User/UserType.js';

const COMMENT_TYPE = new GraphQLObjectType({
    name: 'Comment',
    descriptyion: 'A comment',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'Comment ID'
        },
        'author': {
            type: UserType,
            description: 'Comment\'s author'
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
