// GraphQL
import {
    GraphQLList
} from 'graphql';
// Models
import DocumentCategoryType from './DocumentCategoryType';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let CategoryQuery = {
    'getAllDocumentCategories': {
        type: new GraphQLList(DocumentCategoryType),
        description: 'Get all documentation categories in tree form',
        resolve: async () => {
            let connection = null,
                result = null,
                query = null;
            try {
                query = r.db('work_genius').table('document_categories').coerceTo('array');
                connection = await r.connect({ host: DB_HOST, port: DB_PORT });
                result = await query.run(connection);
                await connection.close();
            } catch (err) {
                return err;
            }
            return result;
        }
    },
};


export default CategoryQuery;
