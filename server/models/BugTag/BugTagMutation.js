// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import {createTag} from './BugTagUtility.js';

let BugTagMutation = {
	'createBugTag': {
		type: GraphQLString,
		description: 'create a bug tag',
        args: {
			data: {
				type: GraphQLString,
				description: 'new bug data'
			}
		},
		resolve: async (root, { data }) => {
			return await createTag(data,'bug');
		}
	},
	'createRelease': {
		type: GraphQLString,
		description: 'create a release',
        args: {
			data: {
				type: GraphQLString,
				description: 'new release data'
			}
		},
		resolve: async (root, { data }) => {
			return await createTag(data,'release');
		}
	},
	'createWorklogTag': {
		type: GraphQLString,
		description: 'create a worklog tag',
        args: {
			data: {
				type: GraphQLString,
				description: 'new worklog tag data'
			}
		},
		resolve: async (root, { data }) => {
			return await createTag(data,'worklog');
		}
	}
};

export default BugTagMutation;