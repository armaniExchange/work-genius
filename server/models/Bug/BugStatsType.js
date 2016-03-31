// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
    GraphQLInt
} from 'graphql';

const BUG_STATS_TYPE = new GraphQLObjectType({
    name: 'BugStatsType',
    descriptyion: 'An bug stats object',
    fields: () => ({
        'name': {
            type: GraphQLString,
            description: 'name'
        },
		'number': {
            type: GraphQLInt,
            description: 'number'
        },
		'percentage': {
            type: GraphQLString,
            description: 'percentage'
        }
    })
});

export default BUG_STATS_TYPE;