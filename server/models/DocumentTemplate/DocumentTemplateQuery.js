// GraphQL
import {
    GraphQLID
} from 'graphql';
// Models
import DocumentTemplateType from './DocumentTemplateType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let DocumentTemplateQuery = {
	getDcoumentTemplate: {
		type: DocumentTemplateType,
		description: 'Get a template by it\'s document type',
      args: {
  			id: {
  				type: GraphQLID,
  				description: 'The id'
  			}
		},
		resolve: async (root, { id }) => {
			let connection = null;

			try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				const result = await r.db('work_genius')
          .table('document_templates')
          .get(id)
          .run(connection);
				return result;
				await connection.close();
			} catch (err) {
        await connection.close();
				return err;
			}
		}
	}
};

export default DocumentTemplateQuery;
