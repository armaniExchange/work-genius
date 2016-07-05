import ReleaseType from './ReleaseType.js';
// GraphQL
import {
	GraphQLString,
	GraphQLList,
	GraphQLObjectType
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT} from '../../constants/configurations.js';

let ReleaseQuery = {
	'getReleaseList': {
		type: new GraphQLList(ReleaseType),
		description: 'Get all release',
        args: {
			name: {
				type: GraphQLString,
				description: 'release name'
			}
		},
		resolve: async (root, { name }) => {
			let connection = null,
			    result = [],
				query = null,
				filterFunc = release =>{
					if(!!name){
			    		return release('name').match(name);
			    	}
			    	return true;
				};

			try {
				//get all groups
				query = r.db('work_genius').table('release').filter(filterFunc)
					.orderBy(r.desc('date'))
					.coerceTo('array');
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let result = await query.run(connection);
				await connection.close();
				result.sort(function(a, b){
					return a.priority - b.priority;
				});
				return result;
			} catch (err) {
				await connection.close();
				console.log(err);
			}
			return result;
		}
	}
};

export default ReleaseQuery;