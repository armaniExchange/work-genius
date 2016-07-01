import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLFloat,
	GraphQLInt,
	GraphQLID
} from 'graphql';

let ReleaseType = new GraphQLObjectType({
	name: 'Release',
	description: 'A Release object',
	fields: () => ({
		'id': {
			type: GraphQLID,
			description: 'Release ID'
		},
		'name': {
			type: GraphQLString,
			description: 'Release Name'
		},
		'date': {
			type: GraphQLFloat,
			description: 'Release Date'
		}
		,
		'priority': {
			type: GraphQLString,
			GraphQLString: 'Release Priority'
		}
	})
});

export default ReleaseType;