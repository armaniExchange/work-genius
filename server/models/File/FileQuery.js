import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

// Download file
// set handler app.get('/files/:id', fileDownloadHandler);
//
// now you can get file by
// GET http://server/files/uniquefileid

export const fileDownloadHandler = async (req, res) => {
  let connection = null;
  try {
    const fileId = req.params.id;
    connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const result = await r.db('work_genius')
      .table('files')
      .get(fileId)
      .run(connection);
    const {
      name,
      path
    } = result;
    await connection.close();
    res.download(path, name, downloadErr => {
      if (downloadErr) {
        throw downloadErr;
      }
    });
  } catch (err) {
    await connection.close();
    res.status(err.status)
      .send({
        error: err
      });
  }
};
