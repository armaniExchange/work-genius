import fs from 'fs';
import r from 'rethinkdb';
import multer from 'multer';
import moment from 'moment';

import { UPLOAD_FILE_LOCATION } from '../../constants/configurations.js';
import { SERVER_FILES_URL } from '../../../src/constants/config';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

export const fileUploadHandler = async (req, res) => {
  const targetDir = `${UPLOAD_FILE_LOCATION}/${moment().format('YYYYMM')}`;
  const upload = multer({dest: targetDir}).single('file');

  upload(req, res, async (err) => {
    if (err) {
      res.status(err.status)
        .send({
          error: err
        });
      return;
    }
    const {
      filename,
      mimetype,
      originalname
    } = req.file;

    try {
      const createdAt = new Date().getTime();
      const fileMetadata = {
        id: filename,
        type: mimetype,
        name: originalname,
        url: `${SERVER_FILES_URL}/${filename}`,
        path: `${targetDir}/${filename}`,
        createdAt
      };
      const query = r.db('work_genius').table('files').insert(fileMetadata);
      const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
      await query.run(connection);
      await connection.close();
      res.status(200).send(fileMetadata);
    } catch (dbErr) {
      res.status(dbErr.status).send({
        error: dbErr
      });
    }
  });
};

export const deleteFile = async (fileId) => {
  let connection = null;
  try {
    connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    let query = null, result = null;
    query = r.db('work_genius')
      .table('files')
      .get(fileId);
    result = await query.run(connection);
    fs.unlinkSync(result.path);
    query = r.db('work_genius')
      .table('files')
      .get(fileId)
      .delete();
    await query.run(connection);
    await connection.close();
  } catch (err) {
    await connection.close();
    throw err;
  }
};

export const fileDeleteHandler = async (req, res) => {
  const fileId = req.params.id;
  try {
    await deleteFile(fileId);
    res.status(204).end();
  } catch (err) {
    res.status(err.status).send({
      error: err
    });
  }
};

