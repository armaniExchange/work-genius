// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList
} from 'graphql';

const WorkLog_TYPE = new GraphQLObjectType({
    name: 'worklog',
    descriptyion: 'An worklog object',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'work log ID'
        },
        'author_id': {
            type: GraphQLString,
            description: 'author ID'
        },
        'author': {
            type: GraphQLString,
            description: 'author'
        },
        'title': {
            type: GraphQLString,
            description: 'title'
        },
        'content': {
        	type: GraphQLString,
        	description: 'work log content'
        },
        'tags': {
            type: new GraphQLList(GraphQLString),
            description: 'tag list'
        },
        'create_date': {
            type: GraphQLFloat,
            description: 'create date'
        },
        'update_date': {
            type: GraphQLFloat,
            description: 'update date'
        },
        'job_id': {
            type: GraphQLString,
            description: 'the related job id'
        }
    })
});

export default WorkLog_TYPE;