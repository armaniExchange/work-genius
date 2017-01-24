// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugMutation = {
	'updateBug': {
		type: GraphQLString,
		description: 'edit a bug ',
        args: {
			data: {
				type: GraphQLString,
				description: 'new bug data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				query = null;

			try {
				let bug = JSON.parse(data);
				//total_row is used for pagination, don't need to be insert into db
				if('total_row' in bug){
					delete bug['total_row'];
				}
				let id = null;
				if(!!bug.id){
					id = bug.id;
					delete bug.id;
				}
				if(!id){
					return 'Fail to update bug!';
				}
				
				try{
					if(('owner' in bug) && typeof bug.owner === 'object') {
						if(bug.owner.length > 0){
							bug.owner = bug.owner[0];
						}else{
							bug.owner = "";
						}
					}
				} catch(err){
					bug.owner = "";
				}
				query = r.db('work_genius').table('bugs_review').get(id).update(bug);
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				await query.run(connection);
				await connection.close();
			} catch (err) {
				return 'Fail to update bug!';
			}
			return 'Update bug successfully!';
		}
	}

};

export default BugMutation;