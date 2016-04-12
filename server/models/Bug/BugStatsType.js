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
        },
        'item6': {
            type: GraphQLInt,
            description: 'stats item 6'
        },
        'item7': {
            type: GraphQLInt,
            description: 'stats item 7'
        },
        'item8': {
            type: GraphQLInt,
            description: 'stats item 8'
        },
        'item9': {
            type: GraphQLInt,
            description: 'stats item 8'
        }
    })
});

export default BUG_STATS_TYPE;