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
import { fileDownloadHandler } from './models/File/FileQuery';
import { addTestReportHandler } from './models/TestReport/TestReportMutation';
import { fetchProductHandler, fetchBuildNumberHandler, changeProductHandler, changeBuildNumberHandler,
  changeModifiedFilenameHandler, changeTabHandler
} from './models/AxapiAutomation/AxapiAutomationQuery';
import { searchArticleHandler, searchFileHandler, searchWorklogHandler, searchCommentHandler, searchBugtrackingHandler } from './models/Search/SearchQuery';
import {
    SECURE_KEY,
    MAIL_TRANSPORTER_CONFIG
} from './constants/configurations.js';
import { articleExportHandler } from './models/Article/ArticleExport.js';

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
  if ( (req.method === 'GET' && req.url.includes('/files/') )||
    (req.method === 'POST' && req.url.includes('/testReport/'))){
    // when downloading file skip token checking
    // when testReport skip token checking
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

app.route('/axapi_automation_api/fetch_product/').get(fetchProductHandler);
app.route('/axapi_automation_api/fetch_build_number/').get(fetchBuildNumberHandler);
app.route('/axapi_automation_api/change_product/').get(changeProductHandler);
app.route('/axapi_automation_api/change_build_number/').get(changeBuildNumberHandler);
app.route('/axapi_automation_api/change_modified_filename/').get(changeModifiedFilenameHandler);
app.route('/axapi_automation_api/change_tab/').get(changeTabHandler);

app.route('/search')
  .get((req, res)=>{
    var searchfor = req.query && req.query.searchfor;
    switch (searchfor) {
      case 'ARTICLE':
      default:
        return searchArticleHandler(req, res);
      case 'FILE':
        return searchFileHandler(req, res);
      case 'WORKLOG':
        return searchWorklogHandler(req, res);
      case 'COMMENT':
        return searchCommentHandler(req, res);
      case 'BUGTRACKING':
        return searchBugtrackingHandler(req, res);
    }
  });

app.route('/files')
  .post(fileUploadHandler);
app.route('/files/:id')
 .get(fileDownloadHandler)
 .delete(fileDeleteHandler);
app.get('/export/document/:articleId', articleExportHandler);
app.route('/testReport/:type')
  .post(addTestReportHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
