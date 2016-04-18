import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

export const fileDownloadHandler = async (req, res) => {
  try {
    const fileId = req.params.id;
    const query = r.db('work_genius').table('files')
          .get(fileId);
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const result = await query.run(connection);
    const {
      name,
      path
    } = result;
    res.download(path, name, downloadErr => {
      if (downloadErr) {
        throw downloadErr;
      }
    });
  } catch (err) {
    res.status(err.status).send({
      error: err
    });
  }
};
