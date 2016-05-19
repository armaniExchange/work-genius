// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLFloat
} from 'graphql';
import PTOType from '../PTO/PTOType.js';
import TaskType from '../Task/TaskType.js';
import JobType from '../Job/JobType.js';
import GroupType from '../Group/GroupType.js';

let UserType = new GraphQLObjectType({
	name: 'User',
	description: 'A User object',
	fields: () => ({
		'id': {
			type: GraphQLString,
			description: 'User ID'
		},
		// 'username': {
		// 	type: GraphQLString,
		// 	description: 'Developer AD account'
		// },
		'password': {
			type: GraphQLString,
			description: 'AD Password stored for craw'
		},
		'name': {
			type: GraphQLString,
			description: 'User name'
		},
		'nickname': {
			type: GraphQLString,
			description: 'User nickname'
		},
		'title': {
			type: GraphQLString,
			description: 'User title'
		},
		'credits': {
			type: GraphQLInt,
			description: 'Team actions will generate credits'
		},
		'counters': {
			type: GraphQLString,
			description: 'counters for users actions, example, comment+1, document+1...'
		},
		'birthday': {
			type: GraphQLString,
			description: 'Birthday'
		},
		'resume': {
			type: GraphQLString,
			description: 'education, family, skills '
		},
		'email': {
			type: GraphQLString,
			description: 'Email address'
		},
		'join_date': {
			type: GraphQLString,
			description: 'Date Time'
		},
		'last_login_date': {
			type: GraphQLString,
			description: 'Date Time'
		},
		'token': {
			type: GraphQLString,
			description: 'User token'
		},
		pto: {
			type: new GraphQLList(PTOType),
			description: 'User pto applications'
		},
		tasks: {
			type: new GraphQLList(TaskType),
			description: 'User tasks'
		},
		privilege: {
			type: GraphQLInt,
			description: 'User privilege level'
		},
		privilege_display_name: {
			type: GraphQLString,
			description: 'User privilege display name'
		},
		alias: {
			type: GraphQLString,
			description: 'User alias'
		},
		overtime_hours: {
			type: GraphQLInt,
			description: 'User\'s leftover hours'
		},
		jobs: {
			type: new GraphQLList(new GraphQLObjectType({
				name: 'UserJobs',
				fields:{
					date: {
			        	type: GraphQLFloat,
			        	description: 'date'
			        },
			        day_type: {
			            type: GraphQLString,
			            description: 'workday/pto/holiday'
			        },
			        'pto_hours': {
			            type: GraphQLInt,
			            description: 'pto hours'
			        },
			        job_items: {
			            type: new GraphQLList(JobType),
			            description: 'job items'
			        },
			        description: {
			        	type: GraphQLString,
			            description: 'public holiday description'
			        }
				}
			})),
			description: 'job list'
		},
		location: {
			type: GraphQLString,
			description: 'location'
		},
		timezone: {
			type: GraphQLInt,
			description: 'timezone'
		},
		groups: {
			type: new GraphQLList(GroupType),
			description: 'user groups'
		}
	})
});

export default UserType;
