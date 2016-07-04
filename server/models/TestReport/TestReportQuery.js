// Use tables:
// test_report_categories
// unit_test_reports
// end2end_test_reports
// axapi_test_reports

// GraphQL
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLFloat
} from 'graphql';
// Models
import TestReportCategoryType from './TestReportCategoryType';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

async function getTestReportCreatedTimeList() {
  const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
  const result = await r.db('work_genius').table('test_report_time_list')
    .group('type')
    .map(function(item){
      return item('createdAt');
    })
    .ungroup()
    .map(function(item) {
      return r.object(item('group'), item('reduction'));
    })
    .reduce(function(left, right){
      return left.merge(right);
    })
    .default({
      unitTest: 0,
      end2endTest: 0,
      axapiTest: 0
    })
    .run(connection) || {};
  return result;
}

let CategoryQuery = {
  'getTestReportCreatedTimeList' : {
    description: 'Get created time list',
    type: new GraphQLObjectType({
      name: 'testCreatedTimeListType',
      fields: () => ({
        unitTestCreatedTimeList: { type : new GraphQLList(GraphQLFloat) },
        end2endTestCreatedTimeList: { type : new GraphQLList(GraphQLFloat) },
        axapiTestCreatedTimeList: { type : new GraphQLList(GraphQLFloat) }
      })
    }),
    resolve: async () => {
      const timeList = await getTestReportCreatedTimeList();
      try {
        return {
          unitTestCreatedTimeList: timeList.unitTest || [],
          end2endTestCreatedTimeList: timeList.end2endTest || [],
          axapiTestCreatedTimeList: timeList.axapiTest || []
        };
      } catch (err) {
        return err;
      }
    }
  },
  'getAllDocumentCategoriesWithTestReport': {
    type: new GraphQLList(TestReportCategoryType),
    description: 'Get all documentation categories in tree form with test report',
    args: {
      unitTestCreatedTime: { type: GraphQLFloat },
      end2endTestCreatedTime: { type: GraphQLFloat },
      axapiTestCreatedTime: { type: GraphQLFloat }
    },
    resolve: async (root, {
      unitTestCreatedTime,
      end2endTestCreatedTime,
      axapiTestCreatedTime
    }) => {
      try {
        const timeList = await getTestReportCreatedTimeList();
        unitTestCreatedTime = unitTestCreatedTime || timeList.unitTest[0] || 0;
        end2endTestCreatedTime = end2endTestCreatedTime || timeList.end2endTest[0] || 0;
        axapiTestCreatedTime = axapiTestCreatedTime || timeList.axapiTest[0] || 0;

        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const result = await r.db('work_genius')
          .table('document_categories')
          .filter({ isFeature: true })
          .merge(function(category) {
            return r.db('work_genius')
              .table('test_report_categories')
              .get(category('id'))
              .default({});
          })
          .merge(function(category) {
            return {
              articlesCount: r.db('work_genius')
                .table('articles')
                .getAll(category('id'), { index: 'categoryId' })
                .count()
            };
          })
          .merge({
              unitTest: r.row('unitTest').default([]).filter({createdAt: unitTestCreatedTime }),
              end2endTest: r.row('end2endTest').default([]).filter({createdAt: end2endTestCreatedTime }),
              axapiTest: r.row('axapiTest').default([]).filter({createdAt: axapiTestCreatedTime }),
           })
          .coerceTo('array')
          .run(connection);
        return result;
        await connection.close();
      } catch (err) {
        return err;
      }
    }
  },
};

export default CategoryQuery;
