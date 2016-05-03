// GraphQL
import {
    GraphQLID,
    GraphQLString,
    GraphQLList
} from 'graphql';
// Models
import BUG_TAG_TYPE from './BugTagType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import {getTagList} from './BugTagUtility.js';

let BugTagQuery = {
	'getAllBugTags': {
		type: new GraphQLList(BUG_TAG_TYPE),
		description: 'Get all bug tags',
        args: {
			name: {
				type: GraphQLString,
				description: 'bug tag name'
			}
		},
		resolve: async (root, { name}) => {
			return await getTagList(name,'bug');
		}
	},
	'getAllRelease': {
		type: new GraphQLList(BUG_TAG_TYPE),
		description: 'Get all release',
        args: {
			name: {
				type: GraphQLString,
				description: 'release name'
			}
		},
		resolve: async (root, { name}) => {
			return await getTagList(name,'release');
		}
	},
	'getAllWorklogTags': {
		type: new GraphQLList(BUG_TAG_TYPE),
		description: 'Get all worklog tags',
        args: {
			name: {
				type: GraphQLString,
				description: 'worklog tag name'
			}
		},
		resolve: async (root, { name}) => {
			return await getTagList(name,'worklog');
		}
	}
};

export default BugTagQuery;