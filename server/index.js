// Libraries
import express from 'express';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
// GraphQL and schema
import schema from './schema/schema.js';
import { loginHandler } from './models/User/UserMutation';
import {
  fileUploadHandler,
  fileDeleteHandler
} from './models/File/FileMutation';
import { fileDownloadHandler } from './models/File/FileQuery';// Constants
import { searchArticleHandler, searchFileHandler } from './models/Search/SearchQuery';
import {
    SECURE_KEY,
    MAIL_TRANSPORTER_CONFIG
} from './constants/configurations.js';

const PORT = 3000;
let app = express();

app.use(bodyParser.text({
  type: 'application/graphql'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE');
  next();
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.send();
  } else {
    next();
  }
});

app.post('/login', loginHandler);

app.use((req, res, next) => {
  if ( req.method === 'GET' && req.url.includes('/files/')){
    // when downloading file skip token checking
    next();
    return;
  }
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, SECURE_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        req.token = token;
        next();
      }
    });
  } else {
    res.status(401).send({
      success: false,
      message: 'No token provided'
    });
  }
});

let transporter = nodemailer.createTransport(MAIL_TRANSPORTER_CONFIG);

app.use('/graphql', graphqlHTTP(request => ({
    schema: schema,
    rootValue: { req: request, transporter },
    pretty: true,
    graphiql: true
})));

app.route('/search')
  .get(searchArticleHandler);
app.route('/search_file')
  .get(searchFileHandler);

app.route('/files')
  .post(fileUploadHandler);
app.route('/files/:id')
 .get(fileDownloadHandler)
 .delete(fileDeleteHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
