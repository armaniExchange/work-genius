// r.db('work_genius').tableCreate('test_report_time_list')
// r.db('work_genius').tableCreate('test_report_categories'),
// r.db('work_genius').table('test_report_categories').indexCreate('path')
// r.db('work_genius').table('test_report_categories').indexCreate('axapis', {multi: true})
// r.db('work_genius').tableCreate('test_report_requests')

// GraphQL
import {
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat
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
  const testReportTypeText = testReportTypeTextMap[testReportType];
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
    if (testReportType === 'end2endTest') {
      const HeaderMd = `Hi Team,  \nFeature Automation pass all the cases\n, everything is awesome.`;
      const mailOption = {
        from: MAILER_ADDRESS,
        to: errorReports.map(item => item.email),
        subject: `[KB - Feature Automation] ${testReportTypeText} report`,
        html: parseMarkdown(HeaderMd),
        cc: MAIL_CC_LIST
      };
      await transporter.sendMail(mailOption);
    } else {
      console.log('no error found this time, skip sending email');
    }
    return;
  }

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
    const framework = req.body.framework || null;

    const data = reports.map((report)=> {
      const {
        path, // for e2e and unit test
        api, // for axapi
        isSuccess,
        errorMessage,
        meta = {}
      } = report;
      const PathOrApiProperty = type === 'axapiTest' ? {
        api: api || '',
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
      }, PathOrApiProperty, framework ? { framework } : null);
    });
    const {
      testReportType,
      tableIndex,
      testReportCategoryTableIndex,
    } = TEST_REPORT_MAP[type];

    const dbResult = await r.db('work_genius')
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
    const reportTime = Object.assign({
        type: testReportType,
        createdAt: createdAt
      }, framework ? { framework } : null );
    const hasReportTime = await r.db('work_genius')
      .table('test_report_time_list')
      .filter(reportTime)
      .count()
      .gt(0)
      .run(connection);

    if (!hasReportTime) {
      await r.db('work_genius')
        .table('test_report_time_list')
        .insert(reportTime)
        .run(connection);
    }

    // for debugging request
    await r.db('work_genius')
      .table('test_report_requests')
      .insert(Object.assign({
        body: req.body,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }, reportTime))
      .run(connection);

    res.status(200)
      .send({
        success: true,
        dbResult
      });

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
      },
      codeETA: {
        type: GraphQLFloat
      },
      docETA: {
        type: GraphQLFloat
      },
      codeStatus: {
        type: GraphQLString
      },
      docStatus: {
        type: GraphQLString
      }
    },
    resolve: async (root, {
      categoryId,
      path,
      axapis,
      owners,
      difficulty,
      codeETA,
      docETA,
      codeStatus,
      docStatus
    }) => {
      const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
      const data = Object.assign(
        { id: categoryId },
        typeof path !== 'undefined' ? { path } : null,
        typeof axapis !== 'undefined' ? { axapis } : null,
        typeof owners !== 'undefined' ? { owners } : null,
        typeof difficulty !== 'undefined' ? { difficulty } : null,
        typeof codeETA !== 'undefined' ? { codeETA } : null,
        typeof docETA !== 'undefined' ? { docETA } : null,
        typeof codeStatus !== 'undefined' ? { codeStatus } : null,
        typeof docStatus !== 'undefined' ? { docStatus } : null,
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
