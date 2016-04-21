// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLInt
} from 'graphql';

const BUG_TAG_TYPE = new GraphQLObjectType({
    name: 'BugTag',
    descriptyion: 'An bug tag object',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'Bug tag ID'
        },
        'tag_name': {
            type: GraphQLString,
            description: 'Bug tag name'
        },
        'bug_count': {
            type: GraphQLInt,
            description: 'Bug tag count'
        },
        'type': {
            type: GraphQLString,
            description: 'tag type'
        }

    })
});

export default BUG_TAG_TYPE;