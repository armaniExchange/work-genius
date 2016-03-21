// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID
} from 'graphql';

const FILE_TYPE = new GraphQLObjectType({
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
        'created_at': {
            type: GraphQLString,
            description: 'File\'s created time'
        },
        'content_type': {
            type: GraphQLString,
            description: 'File\'s content type'
        },
        'file_url': {
            type: GraphQLString,
            description: 'File url'
        },
        'origin_name': {
            type: GraphQLString,
            description: 'File original name'
        },
        'path': {
            type: GraphQLString,
            description: 'File path'
        }
    })
});

export default FILE_TYPE;
