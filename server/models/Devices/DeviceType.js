// GraphQL types
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt
} from 'graphql';

let DeviceType = new GraphQLObjectType({
	name: 'Devices',
	description: 'A User object',
	fields: () => ({
		'ip': {
			type: GraphQLString,
			description: 'IP address for this device'
		},
		'address': {
			type: GraphQLString,
			description: 'Location'
		},
		'apc': {
			type: new GraphQLObjectType({
				name: 'apc',
				fields:{
					id: {
		        		type: GraphQLString,
		        		description: 'id'
		        },
		        url: {
		            type: GraphQLString,
		            description: 'url'
		        },
		        'username': {
		            type: GraphQLString,
		            description: 'username'
		        },
		        password: {
		            type: GraphQLString,
		            description: 'password'
		        }
				}
			}),
			description: 'job list'
		},
		'console': {
			type: GraphQLString,
			description: 'Console port'
		},
		'model': {
			type: GraphQLString,
			description: 'Model'
		},
		'product_id_magic': {
			type: GraphQLString,
			description: 'Product ID Magic'
		},
		'vcs_configured': {
			type: GraphQLString,
			description: 'Whether configured VCS Pairs',
		},
		'is_e2e_machine': {
			type: GraphQLString,
			description: 'If it is a E2E Or AXAPI test machine'
		},
		'can_send_traffic': {
			type: GraphQLString,
			description: 'Can Send Traffic'
		},
		'release': {
			type: GraphQLString,
			description: 'Release Name'
		},
		'build': {
			type: GraphQLInt,
			description: 'Build Number'
		},
		'with_fpga': {
			type: GraphQLInt,
			description: 'If with FPGA ,use 52 instead of 20'
		},
		'locked_by': {
			type: GraphQLString,
			description: 'Locker Name'
		},
		'locked_date': {
			type: GraphQLString,
			description: 'Date Time'
		},
		'user_name': {
			type: GraphQLString,
			description: 'Login Name'
		},
		'password': {
			type: GraphQLString,
			description: 'Login Password'
		},
		'upgrading': {
			type: GraphQLInt,
			description: 'Whether it is upgrading'
		} 
	})
});

export default DeviceType;
