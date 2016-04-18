// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLInt,
    GraphQLFloat
} from 'graphql';

const WorkLog_TYPE = new GraphQLObjectType({
    name: 'worklog',
    descriptyion: 'An bug object',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'work log ID'
        },
        'employee_id': {
            type: GraphQLString,
            description: 'employee ID'
        },
        'date': {
        	type: GraphQLFloat,
        	description: 'date'
        },
        'content': {
        	type: GraphQLString,
        	description: 'work log content'
        },
        'progress': {
        	type: GraphQLInt,
        	description: 'progress'
        },
        'type': {
            type: GraphQLString,
            description: 'workday/pto/holiday'
        },
        'tag': {
            type: GraphQLString,
            description: 'worklog tag'
        },
        'status': {
            type: GraphQLInt,
            description: 'is completed or not'
        },
        'task': {
            type: GraphQLString,
            description: 'task title'
        },
        'duration': {
            type: GraphQLInt,
            description: 'task duration'
        },
        'release': {
            type: GraphQLString,
            description: 'release name'
        },
        'creater': {
            type: GraphQLString,
            description: 'task creater'
        }
    })
});

export default WorkLog_TYPE;