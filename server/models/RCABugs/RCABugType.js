// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLInt
} from 'graphql';

const RCA_BUG_TYPE = new GraphQLObjectType({
    name: 'RCABug',
    descriptyion: 'An RCA bug object',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'RCA Bug Item ID'
        },
		//addtional property list
		'employee_id': {
			type: GraphQLString,
            description: 'employee_id'
		},
		'employee_name': {
			type: GraphQLString,
            description: 'employee_name'
		},
		'bug_count': {
			type: GraphQLInt,
            description: 'bug_count'
		},
		'year': {
			type: GraphQLInt,
            description: 'year'
		}
    })
});

export default RCA_BUG_TYPE;