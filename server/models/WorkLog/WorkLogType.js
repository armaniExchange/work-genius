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
        'start_date': {
        	type: GraphQLFloat,
        	description: 'start date'
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
        'color': {
            type: GraphQLString,
            description: 'worklog color'
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
        'creator': {
            type: GraphQLString,
            description: 'task creator'
        },
        'tags': {
            type: new GraphQLList(GraphQLString),
            description: 'tag list'
        }
    })
});

export default WorkLog_TYPE;