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

async function getTestReportCreatedTimeList(tableName) {
  const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
  const result = await r.db('work_genius')
    .table(tableName)('createdAt')
    .distinct()
    .orderBy(r.desc(r.row))
    .default([0])
    .coerceTo('array')
    .run(connection);
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
      try {
        const unitTestCreatedTimeList = await getTestReportCreatedTimeList('unit_test_reports');
        const end2endTestCreatedTimeList = await getTestReportCreatedTimeList('end2end_test_reports');
        const axapiTestCreatedTimeList = await getTestReportCreatedTimeList('axapi_test_reports');
        return {
          unitTestCreatedTimeList,
          end2endTestCreatedTimeList,
          axapiTestCreatedTimeList
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
        const unitTestCreatedTimeList = await getTestReportCreatedTimeList('unit_test_reports');
        const end2endTestCreatedTimeList = await getTestReportCreatedTimeList('end2end_test_reports');
        const axapiTestCreatedTimeList = await getTestReportCreatedTimeList('axapi_test_reports');
        unitTestCreatedTime = unitTestCreatedTime || unitTestCreatedTimeList[0] || 0;
        end2endTestCreatedTime = end2endTestCreatedTime || end2endTestCreatedTimeList[0] || 0;
        axapiTestCreatedTime = axapiTestCreatedTime || axapiTestCreatedTimeList[0] || 0;

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
                .count(),
              unitTest: r.db('work_genius')
                .table('unit_test_reports')
                .filter({ createdAt: unitTestCreatedTime })
                .filter({ path: category('path').default('') })
                .coerceTo('array'),
              end2endTest: r.db('work_genius')
                .table('end2end_test_reports')
                .filter({ createdAt: end2endTestCreatedTime })
                .filter({ path: category('path').default('') })
                .coerceTo('array'),
              axapiTest: r.db('work_genius')
                .table('axapi_test_reports')
                .filter({ createdAt: axapiTestCreatedTime })
                .filter(function(report){
                  return category('axapis').contains(report('api'));
                })
                .coerceTo('array')
            };
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
