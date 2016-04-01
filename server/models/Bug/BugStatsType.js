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
        },
        'item1': {
            type: GraphQLInt,
            description: 'stats item 1'
        },
        'item2': {
            type: GraphQLInt,
            description: 'stats item 2'
        },
        'item3': {
            type: GraphQLInt,
            description: 'stats item 3'
        },
        'item4': {
            type: GraphQLInt,
            description: 'stats item 4'
        },
        'item5': {
            type: GraphQLInt,
            description: 'stats item 5'
        }
    })
});

export default BUG_STATS_TYPE;