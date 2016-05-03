// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList
} from 'graphql';

const JobType = new GraphQLObjectType({
    name: 'Job',
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
        'title': {
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
        },
        'end_date': {
            type: GraphQLFloat,
            description: 'end date'
        },
        'pto_hours': {
            type: GraphQLInt,
            description: 'pto hours'
        }
    })
});

export default JobType;