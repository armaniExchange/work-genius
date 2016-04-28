// GraphQL
import {
    GraphQLString,
    GraphQLID
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let mutation = {
    'upsertDocumentCategory': {
        type: GraphQLString,
        description: 'insert a new category',
        args: {
            data: {
                type: GraphQLString,
                description: 'new category data to be inserted'
            }
        },
        resolve: async (root, { data }) => {
            let connection = null,
                query = null;

            try {
                data = JSON.parse(data);
                query = r.db('work_genius').table('document_categories').insert(data, {conflict: 'replace'});
                connection = await r.connect({ host: DB_HOST, port: DB_PORT });
                await query.run(connection);
                await connection.close();
            } catch (err) {
                return `Fail to create category! Error: ${err}`;
            }
            return 'Create category successfully!';
        }
    },
    'deleteDocumentCategory': {
        type: GraphQLString,
        description: 'insert a new category',
        args: {
            id: {
                type: GraphQLID,
                description: 'category id to delete'
            }
        },
        resolve: async (root, { id }) => {
            let connection = null,
                query = null;

            try {
                query = r.db('work_genius').table('document_categories').get(id).delete();
                connection = await r.connect({ host: DB_HOST, port: DB_PORT });
                await query.run(connection);
                await connection.close();
            } catch (err) {
                return `Fail to delete category! Error: ${err}`;
            }
            return 'Delete category successfully!';
        }
    }
};

export default mutation;
