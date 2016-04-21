import fs from 'fs';
import r from 'rethinkdb';
import multer from 'multer';
import moment from 'moment';

import { UPLOAD_FILE_LOCATION } from '../../constants/configurations.js';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';


// upload file
//
// POST http://server/files
// multer will save the file instance into disk
// add metadata into db files

export const fileUploadHandler = async (req, res) => {
  const targetDir = `${UPLOAD_FILE_LOCATION}/${moment().format('YYYYMM')}`;
  const upload = multer({dest: targetDir}).single('file');

  let connection = null;

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
        path: `${targetDir}/${filename}`,
        createdAt
      };
      connection = await r.connect({ host: DB_HOST, port: DB_PORT });
      await r.db('work_genius')
        .table('files')
        .insert(fileMetadata)
        .run(connection);
      await connection.close();
      res.status(200).send(fileMetadata);
    } catch (dbErr) {
      await connection.close();
      res.status(dbErr.status)
      .send({ error: dbErr });
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
    if (result) {
      fs.unlinkSync(result.path);
      query = r.db('work_genius')
        .table('files')
        .get(fileId)
        .delete();
      await query.run(connection);
    }
    await connection.close();
  } catch (err) {
    await connection.close();
    throw err;
  }
};


// Delete file
// now you can delete file by
// DELETE http://server/files/uniquefileid

export const fileDeleteHandler = async (req, res) => {
  const fileId = req.params.id;
  try {
    await deleteFile(fileId);
    res.status(204).end();
  } catch (err) {
    res.status(err.status)
      .send({ error: err });
  }
};

