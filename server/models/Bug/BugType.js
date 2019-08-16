// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLInt,
	GraphQLList
} from 'graphql';

const BUG_TYPE = new GraphQLObjectType({
	name: 'Bug',
	descriptyion: 'An bug object',
	fields: () => ({
		'id': {
			type: GraphQLID,
			description: 'Bug ID'
		},
		//addtional property list
		'display_id': {
			type: GraphQLString,
			description: 'display_id'
		},
		'group': {
			type: GraphQLString,
			description: 'group'
		},
		'assigned_to': {
			type: GraphQLString,
			description: 'assigned_to'
		},
		'bug_severity': {
			type: GraphQLString,
			description: 'bug_severity'
		},
		'bug_status': {
			type: GraphQLString,
			description: 'bug_status'
		},
		'label': {
			type: GraphQLString,
			description: 'label'
		},
		'menu': {
			type: new GraphQLList(GraphQLString),
			description: 'menu'
		},
		'resolved_type': {
			type: GraphQLString,
			description: 'resolved_type'
		},
		'review': {
			type: GraphQLString,
			description: 'review'
		},
		'tags': {
			type: new GraphQLList(GraphQLString),
			description: 'tags'
		},
		'title': {
			type: GraphQLString,
			description: 'title'
		},
		'resolution': {
			type: GraphQLString,
			description: 'resolution'
		},
		'total_row': {
			type: GraphQLInt,
			description: 'total row (for pagination)'
		},
		'introduced_by': {
			type: new GraphQLList(GraphQLString),
			description: 'menu'
		},
		'owner': {
			type: GraphQLString,
			description: "Bug module owner"
		}
	})
});

export default BUG_TYPE;
