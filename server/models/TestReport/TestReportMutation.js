// GraphQL
import {
  GraphQLString,
  GraphQLID,
  GraphQLList
} from 'graphql';

// RethinkDB
import r from 'rethinkdb';

// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

// upload file
//
// POST http://server/files
// multer will save the file instance into disk
// add metadata into db files

export const addTestReportHandler = async (req, res) => {
  let connection = null;
  const type = req.params.type;
  try {
    connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const createdAt = new Date().getTime();
    const data = req.body.reports.map((report)=> {
      const {
        path, // for e2e and unit test
        api, // for axapi
        isSuccess,
        errorMessage
      } = report;
      const PathOrApiProperty = type === 'axapiTest' ? {
        api: api || ''
      } : {
        path: path || ''
      };
      return Object.assign({
        errorMessage: errorMessage || '',
        isSuccess,
        type,
        createdAt
      }, PathOrApiProperty);
    });

    let reportsTableName;
    switch (type) {
      case 'axapiTest':
        reportsTableName = 'axapi_test_reports';
        break;
      case 'unitTest':
        reportsTableName = 'unit_test_reports';
        break;
      case 'end2endTest':
        reportsTableName = 'end2end_test_reports';
        break;
      default:
        throw `API ${type} doesn't existed`;
    }
    await r.db('work_genius')
      .table(reportsTableName)
      .insert(data)
      .run(connection);
    res.status(200)
      .send({success: true});
    await connection.close();
  } catch (err) {
    await connection.close();
    res.status(err.status)
      .send({ error: err });
  }
};

const mutation = {
  setupTestReportOfCategory: {
    type: GraphQLString,
    description: 'setup test report related in category',
    args: {
      categoryId: {
        type: GraphQLID
      },
      path: {
        type: GraphQLString
      },
      axapis: {
        type: new GraphQLList(GraphQLString),
      },
    },
    resolve: async (root, {
      categoryId,
      path,
      axapis
    }) => {
      const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
      try {
        await r.db('work_genius')
          .table('test_report_categories')
          .insert({
            id: categoryId,
            path: path || '',
            axapis: axapis || []
          }, { conflict: 'replace' })
          .run(connection);
        await connection.close();
      } catch (err) {
        await connection.close();
        return `Error: ${err}`;
      }
    }
  }
};

export default mutation;
