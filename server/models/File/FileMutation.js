import multer from 'multer';
import {
    UPLOAD_FILE_LOCATION
} from '../../constants/configurations.js';

const upload = multer({dest: UPLOAD_FILE_LOCATION}).single('file');

export const fileUploadHandler = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(401).send({
        error: err
      });
      return;
    }
    const {
      filename,
      mimetype,
      originalname
    } = req.file;

    // TODO:
    // Please add the file into db
    // and respond client with db data
    // and return file url

    res.status(200).send({
      id: filename,
      type: mimetype,
      name: originalname,
      url: 'http://theUrlToGetTheFile'
    });
  });
};
