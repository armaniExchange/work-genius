// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import DocumentTemplateType from './DocumentTemplateType.js';
import DocumentTemplateInputType from './DocumentTemplateInputType.js';

const DocumentTemplateMutation = {
  updateDocumentTemplate: {
    type: DocumentTemplateType,
    description: 'update document type',
    args: {
      documentTemplate: { type: DocumentTemplateInputType },
    },
    resolve: async ({ req, transporter }, { documentTemplate }) => {
      let connection = null;
      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const user = req.decoded;
        const now = new Date().getTime();
        const newData = {
          id: documentTemplate.id,
          authorId: user.id,
          content: documentTemplate.content,
          updatedAt: now
        };
        await r.db('work_genius')
          .table('document_templates')
          .insert(newData, {conflict: 'update'})
          .run(connection);
        return newData;
        await connection.close();
      } catch (err) {
        await connection.close();
        return err;
      }
    }
  }
};

export default DocumentTemplateMutation;
