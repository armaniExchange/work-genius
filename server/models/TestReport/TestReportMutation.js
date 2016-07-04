// GraphQL
import {
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt
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

const TEST_REPORT_MAP = {
  'axapiTest': {
    testReportType: 'axapiTest',
    tableIndex: 'api',
    testReportCategoryTableIndex: 'axapis',
  },
  unitTest: {
    testReportType: 'unitTest',
    tableIndex: 'path',
    testReportCategoryTableIndex: 'path',
  },
  end2endTest: {
    testReportType: 'end2endTest',
    tableIndex: 'path',
    testReportCategoryTableIndex: 'path',
  }
};

export const addTestReportHandler = async (req, res) => {
  let connection = null;
  try {
    connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const { type } = req.params;
    const { reports } = req.body;
    const createdAt = req.body.createdAt || new Date().getTime();
    const product = req.body.product || '';
    const build = req.body.build || '';
    const data = reports.map((report)=> {
      const {
        path, // for e2e and unit test
        api, // for axapi
        isSuccess,
        errorMessage,
        meta = {}
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
        meta,
        createdAt,
        product,
        build
      }, PathOrApiProperty);
    });
    const {
      testReportType,
      tableIndex,
      testReportCategoryTableIndex,
    } = TEST_REPORT_MAP[type];


    await r.db('work_genius')
      .table('test_report_time_list')
      .insert({
        type: testReportType,
        createdAt: createdAt
      })
      .run(connection);

    await r.db('work_genius')
      .table('test_report_categories')
      .insert(
        r.expr(data)
        .eqJoin(tableIndex, r.db('work_genius').table('test_report_categories'), {index: testReportCategoryTableIndex})
        .group('right')
        .map(function(row){return row('left');})
        .ungroup()
        .map(function(item){
          return item('group').merge({
            [testReportType]: item('group')(testReportType).default([]).add(item('reduction'))
          });
        }), {conflict: 'update'}
      )
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
      owners: {
        type: new GraphQLList(GraphQLID),
      },
      difficulty: {
        type: GraphQLInt
      }
    },
    resolve: async (root, {
      categoryId,
      path,
      axapis,
      owners,
      difficulty,
    }) => {
      const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
      const data = Object.assign(
        { id: categoryId },
        typeof path !== 'undefined' ? { path } : null,
        typeof axapis !== 'undefined' ? { axapis } : null,
        typeof owners !== 'undefined' ? { owners } : null,
        typeof difficulty !== 'undefined' ? { difficulty } : null
      );
      try {
        await r.db('work_genius')
          .table('test_report_categories')
          .insert(data, { conflict: 'update' })
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
