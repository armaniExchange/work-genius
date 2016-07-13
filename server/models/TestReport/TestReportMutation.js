// r.db('work_genius').tableCreate('test_report_categories'),
// r.db('work_genius').table('test_report_categories').createIndex('path')
// r.db('work_genius').table('test_report_categories').createIndex('axapis')
// r.db('work_genius').tableCreate('test_report_time_list')

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
import { DB_HOST, DB_PORT, MAILER_ADDRESS, MAIL_CC_LIST } from '../../constants/configurations.js';

import parseMarkdown from '../../libraries/parseMarkdown';

const testReportTypeTextMap = {
  axapiTest: 'AXAPI Test',
  end2endTest: 'End to end Test',
  unitTest: 'Unit Test',
};

const notifyOwnersErrorsWithEmail = async (transporter, testReportType, createdAt)=> {
  const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
  const errorReports = await r.db('work_genius').table('users')
    .eqJoin('id', r.db('work_genius').table('test_report_categories'), {index: 'owners'})
    .zip()
    .map({
      email: r.row('email'),
      name: r.row('name'),
      [testReportType]: r.row(testReportType).filter({isSuccess: false, createdAt: createdAt}).default([])
    })
    .filter(r.row('email').and(r.row('name')).and(r.row(testReportType).count().gt(0)))
    .group('email', 'name')
    .ungroup()
    .map({
      email: r.row('group')(0).default(''),
      name: r.row('group')(1).default('unknown'),
      [testReportType]: r.row('reduction')(testReportType)
        .reduce((left, right)=> left.add(right)).default([])
    })
    .run(connection);

  if (errorReports.length === 0) {
    console.log('No issues found');
    return;
  }
  const testReportTypeText = testReportTypeTextMap[testReportType];
  const HeaderMd = `Hi Team,  \nFeature Automation test found issues, please take a look at it, thank you.\n`;
  const errorReportsMd = errorReports.map(errorReport=>{
      return `## ${errorReport.name}\n
<span style="color:red;">${testReportTypeText}: ${errorReport[testReportType].length} Fails</span>\n
---\n\`\`\`js\n
${JSON.stringify(errorReport[testReportType], null, '  ')}\n
\`\`\`\n`;
    }).join('\n');
  const mailOption = {
    from: MAILER_ADDRESS,
    to: errorReports.map(item => item.email),
    subject: `[KB - Feature Automation] ${testReportTypeText} failed report`,
    html: parseMarkdown(HeaderMd + errorReportsMd),
    cc: MAIL_CC_LIST
  };
  await transporter.sendMail(mailOption);
};

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
  const { transporter } = req;

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

    await r.db('work_genius')
      .table('test_report_time_list')
      .insert({
        type: testReportType,
        createdAt: createdAt
      })
      .run(connection);

    res.status(200)
      .send({success: true});

    await connection.close();
    await notifyOwnersErrorsWithEmail(transporter, testReportType, createdAt);
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
