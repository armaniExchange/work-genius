// GraphQL
import {
	GraphQLString,
	GraphQLFloat,
	GraphQLID
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let ReleaseMutation = {
	'createRelease': {
		type: GraphQLString,
		description: 'Create a new release',
		args: {
			data: {
				type: GraphQLString,
				description: 'new release data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				
				let release = JSON.parse(data);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('release').insert(release);
				let result = await query.run(connection);
				await connection.close();
				let id = '';
			    if (result && result.generated_keys && result.generated_keys.length > 0){
			      id = result.generated_keys[0];
			    }
		        return id;
			} catch (err) {
				console.log(err);
				await connection.close();
				return 'Fail to create a release!';
			}
		}
	},
	'updateRelease': {
		type: GraphQLString,
		description: 'Update a new release',
		args: {
			id: {
				type: GraphQLID,
				description: 'release id'
        	},
			data: {
				type: GraphQLString,
				description: 'new release data'
			}
		},
		resolve: async (root, { id , data }) => {
			let connection = null,
				query = null;

			try {
				
				let release = JSON.parse(data);
				if('id' in release){
					delete release['id'];
				}
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('release').get(id).update(release);
				let result = await query.run(connection);
				await connection.close();
			} catch (err) {
				console.log(err);
				await connection.close();
				return 'Fail to update a release!';
			}
			return 'Update release successfully!';
		}
	},
	'deleteRelease': {
		type: GraphQLString,
		description: 'Update a new release',
		args: {
			id: {
				type: GraphQLID,
				description: 'release id'
        	}
		},
		resolve: async (root, { id }) => {
			let connection = null,
				query = null;

			try {
				
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('release').get(id).delete();
				let result = await query.run(connection);
				await connection.close();
			} catch (err) {
				console.log(err);
				await connection.close();
				return 'Fail to delete a release!';
			}
			return 'Delete release successfully!';
		}
	},
	'modifyRelease': {
		type: GraphQLString,
		description: 'modify a new release',
		args: {
			data: {
				type: GraphQLString,
				description: 'new release data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				
				let release = JSON.parse(data);
				if(!('name' in release)){
					return 'Fail to modify a release!';
				}
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				query = r.db('work_genius').table('release')
					.filter({name: release.name})
					.coerceTo('array');
				let originalRelease = await query.run(connection);
				if(originalRelease && originalRelease.length > 0){
					query = r.db('work_genius').table('release')
						.get(originalRelease[0].id)
						.update(release);
				} else {
					query = r.db('work_genius').table('release').insert(release);
				}
				let result = await query.run(connection);
				await connection.close();
			} catch (err) {
				console.log(err);
				await connection.close();
				return 'Fail to modify a release!';
			}
			return 'Modify release successfully!';
		}
	}
};

export default ReleaseMutation;