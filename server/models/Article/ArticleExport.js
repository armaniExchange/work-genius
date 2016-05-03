import markdownpdf from 'markdown-pdf';
import streamifier from 'streamifier';
// RethinkDB
import r from 'rethinkdb';

// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

export const articleExportHandler = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const result = await r.db('work_genius')
      .table('articles')
      .get(articleId)
      .run(connection);

    res.setHeader('Content-disposition', 'attachment; filename=' + result.title + '.pdf');
    res.setHeader('Content-type', 'application/pdf');
    await connection.close();

    markdownpdf().from.string(result.content)
      .to.buffer((err, buffer) => {
        if (err) { throw err; }
        streamifier.createReadStream(buffer).pipe(res);
      });
  } catch (error) {
    res.status(error.status)
      .send({error: error});
  }

};
