// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let Mutation = {
  'updateAssignmentCategory': {
    type: GraphQLString,
    description: 'edit a assignment',
    args: {
      data: {
        type: GraphQLString,
        description: 'new assignment data for update'
      }
    },
    resolve: async (root, { data }) => {
      let connection = null,
          query = null;

      try {
        console.log('data(before):');
        console.log(data);
        data = JSON.parse(data);
        console.log('data(after):');
        console.log(data);
        let id = null;
        if(data.id){
          id = data.id;
          delete data.id;
        }
        if(!id){
          return 'Fail to update data!';
        }
	      console.log('mutation id', id);
        query = r.db('work_genius').table('assignment_categories').get(id).update(data);
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        await query.run(connection);
        await connection.close();
      } catch (err) {
        return 'Fail to update assignment!';
      }
      return 'Update assignment successfully!';
    }
  }

};

export default Mutation;
