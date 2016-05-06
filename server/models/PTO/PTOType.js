// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLInt
} from 'graphql';

let PTOType = new GraphQLObjectType({
	name: 'PTO',
	description: 'A PTO object',
	fields: () => ({
		'id': {
			type: GraphQLID,
			description: 'PTO ID'
		},
		'start_time': {
			type: GraphQLString,
			description: 'PTO start time'
		},
		'end_time': {
			type: GraphQLString,
			description: 'PTO end time'
		},
		'applicant': {
			type: GraphQLString,
			description: 'PTO applicant'
		},
		'applicant_id': {
			type: GraphQLID,
			description: 'Applicant ID'
		},
		'hours': {
			type: GraphQLString,
			description: 'Total hours of PTO'
		},
		'status': {
			type: GraphQLString,
			description: 'Current pto application status'
		},
		'memo': {
			type: GraphQLString,
			description: 'PTO application memo'
		},
		'apply_time': {
			type: GraphQLString,
			description: 'Time when this PTO application is applied'
		},
		'applicant_email': {
			type: GraphQLString,
			description: 'Applicant\'s email for this pto application'
		},
		'work_day_hours': {
			type: GraphQLInt,
			description: 'Hours need to be applied on workday for this pto application'
		}
	})
});

export default PTOType;
