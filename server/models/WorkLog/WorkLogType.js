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
        }
    })
});

export default WorkLog_TYPE;