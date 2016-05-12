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
    resolve: async () => {
      try {
        const unitTestCreatedTimeList = await getTestReportCreatedTimeList('unit_test_reports');
        const end2endTestCreatedTimeList = await getTestReportCreatedTimeList('end2end_test_reports');
        const axapiTestCreatedTimeList = await getTestReportCreatedTimeList('axapi_test_reports');

        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const result = await r.db('work_genius')
          .table('document_categories')
          .filter({ isFeature: true })
          .merge(function(documentCategory) {
            return r.db('work_genius')
              .table('test_report_categories')
              .get(documentCategory('id'))
              .default({});
          })
          .merge(function(item) {
            var unitTest = r.db('work_genius')
              .table('unit_test_reports')
              .filter({createdAt: unitTestCreatedTimeList[0]})
              .filter({ path: item('path').default('') })
              .coerceTo('array');

            var end2EndTest = r.db('work_genius')
              .table('end2end_test_reports')
              .filter({createdAt: end2endTestCreatedTimeList[0]})
              .filter({ path: item('path').default('') })
              .coerceTo('array');

            var axapiTest = r.db('work_genius')
              .table('axapi_test_reports')
              .filter({createdAt: axapiTestCreatedTimeList[0]})
              .filter(function(report){
                return item('axapis').contains(report('api'));
              })
              .coerceTo('array');

            return {
              unitTest: unitTest,
              end2endTest: end2EndTest,
              axapiTest: axapiTest
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
