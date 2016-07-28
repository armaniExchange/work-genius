// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
    GraphQLInt,
    GraphQLList
} from 'graphql';
import UserType from '../User/UserType.js';

const GroupType = new GraphQLObjectType({
    name: 'Group',
    descriptyion: 'A group object',
    fields: () => ({
        'id': {
            type: GraphQLID,
            description: 'group ID'
        },
        'name': {
            type: GraphQLString,
            description: 'group name'
        },
        'leader': {
        	type: GraphQLString,
        	description: 'group leader'
        },
        'isDefault': {
            type: GraphQLInt,
            description: 'is default group or not'
        },
        'members': {
            type: new GraphQLList(UserType),
            description: 'group members'
        }
    })
});

export default GroupType;