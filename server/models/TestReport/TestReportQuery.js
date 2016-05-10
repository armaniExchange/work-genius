// GraphQL
import {
  GraphQLList
} from 'graphql';
// Models
import TestReportCategoryType from './TestReportCategoryType';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let CategoryQuery = {
  'getAllDocumentCategoriesWithReportTest': {
    type: new GraphQLList(TestReportCategoryType),
    description: 'Get all documentation categories in tree form',
    resolve: async () => {
      try {
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
              // .filter({createdAt: 123456})
              .filter({ path: item('path').default('') })
              .coerceTo('array');

            var end2EndTest = r.db('work_genius')
              .table('end2end_test_reports')
              // .filter({createdAt: 123456})
              .filter({ path: item('path').default('') })
              .coerceTo('array');

            var axapiTest = r.db('work_genius')
              .table('axapi_test_reports')
              // .filter({createdAt: 123456})
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
