// Use tables:
// test_report_categories
// test_report_axapi_suggestions

// GraphQL
import {
  GraphQLList,
  GraphQLID,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLInputObjectType
} from 'graphql';
// Models
import TestReportCategoryType from './TestReportCategoryType';
import TestReportCategorySetupType from './TestReportCategorySetupType';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

async function getTestReportCreatedTimeList() {
  const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
  const result = await r.db('work_genius').table('test_report_time_list')
    .group('type')
    .orderBy(r.desc('createdAt'))
    .without('type', 'id')
    .ungroup()
    .map(function(item) {
      return r.object(item('group') , item('reduction'));
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

function filterByQueryCreatedAt(item, query) {
  return r.expr(query.map(eachItem=> ({ createdAt: eachItem.createdAt }))).contains({
    createdAt: item('createdAt')
  });
}

const TestReportQueryParamsType = new GraphQLList(
  new GraphQLInputObjectType({
    name: 'testReportQueryParams',
    fields:{
      createdAt: { type: GraphQLFloat },
      framework: { type: GraphQLString }
    }
  })
);

const TestReportCreatedTimeType =  new GraphQLObjectType({
  name: 'TestReportCreatedTimeType',
  fields: {
    createdAt: { type: GraphQLFloat },
    framework: { type: GraphQLString }
  }
});

const mergeDocumentCategoriesWithSettings = (category) => {
  return r.db('work_genius')
    .table('test_report_categories')
    .get(category('id'))
    .without('end2endTest', 'unitTest', 'axapiTest')
    .default({});
};

let CategoryQuery = {
  'getTestReportCreatedTimeList' : {
    description: 'Get created time list',
    type: new GraphQLObjectType({
      name: 'testCreatedTimeListType',
      fields: () => ({
        unitTestCreatedTimeList: { type: new GraphQLList(TestReportCreatedTimeType) },
        end2endTestCreatedTimeList: { type: new GraphQLList(TestReportCreatedTimeType) },
        axapiTestCreatedTimeList: { type: new GraphQLList(TestReportCreatedTimeType) },
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
      unitTestQuery: {
        type: TestReportQueryParamsType
      },
      end2endTestQuery: {
        type:TestReportQueryParamsType
      },
      axapiTestQuery: {
        type: TestReportQueryParamsType
      },
    },
    resolve: async (root, {
      unitTestQuery,
      end2endTestQuery,
      axapiTestQuery
    }) => {
      try {
        const timeList = await getTestReportCreatedTimeList();
        const defaultTime = { createdAt: 0 };
        axapiTestQuery = axapiTestQuery || [(timeList.axapiTest ? timeList.axapiTest[0] : defaultTime)];
        end2endTestQuery = end2endTestQuery || [(timeList.end2endTest ? timeList.end2endTest[0] : defaultTime)];


        unitTestQuery = unitTestQuery || [];

        const unitTestAngularList = timeList.unitTest.filter(item => item.framework === 'angular');
        const unitTestDjangoList = timeList.unitTest.filter(item => item.framework === 'django');

        if (unitTestQuery.filter(item => item.framework === 'angular').length === 0) {
          if (unitTestAngularList.length > 0) {
            unitTestQuery.push({ createdAt: unitTestAngularList[0].createdAt });
          }
        }

        if (unitTestQuery.filter(item => item.framework === 'django').length === 0) {
          if (unitTestDjangoList.length > 0) {
            unitTestQuery.push({ createdAt: unitTestDjangoList[0].createdAt });
          }
        }


        if (unitTestQuery.length === 0) {
          unitTestQuery.push(timeList.unitTest.length > 0 ?{
            createdAt:  timeList.unitTest[0].createdAt
          }: defaultTime);
        }


        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const result = await r.db('work_genius')
          .table('document_categories', {readMode: 'outdated'})
          .filter({ isFeature: true })
          .merge(function(category) {
            return r.db('work_genius')
              .table('test_report_categories', {readMode: 'outdated'})
              .get(category('id'))
              .default({});
          })
          .merge({
              unitTest: r.row('unitTest').default([]).filter(item => filterByQueryCreatedAt(item, unitTestQuery)),
              end2endTest: r.row('end2endTest').default([]).filter(item => filterByQueryCreatedAt(item, end2endTestQuery)),
              axapiTest: r.row('axapiTest').default([]).filter(item => filterByQueryCreatedAt(item, axapiTestQuery)),
           })
          .coerceTo('array')
          .run(connection);
        await connection.close();
        return result;
      } catch (err) {
        return err;
      }
    }
  },
  'getTestReportAxapiSuggestion': {
    type: new GraphQLList(GraphQLString),
    description: 'Get axapi suggestion',
    resolve: async () => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const result = await r.db('work_genius')
          .table('test_report_axapi_suggestions')
          .map(r.row('api'))
          .coerceTo('array')
          .run(connection);
        await connection.close();
        return result;
      } catch (err) {
        return err;
      }
    }
  },
  'getAllDocumentCategoriesWithSettings': {
    type: new GraphQLList(TestReportCategorySetupType),
    description: 'Get axapi suggestion',
    resolve: async () => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const result = await r.db('work_genius')
          .table('document_categories')
          .filter({ isFeature: true })
          .merge(mergeDocumentCategoriesWithSettings)
          .coerceTo('array')
          .run(connection);
        await connection.close();
        return result;
      } catch (err) {
        return err;
      }
    }
  },
  getDocumentCategoryWithSettings :{
    type: TestReportCategorySetupType,
    args: {
      id: {
        type: GraphQLID
      }
    },
    resolve: async (root, {id}) => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const result = await r.db('work_genius')
          .table('document_categories')
          .get(id)
          .merge(mergeDocumentCategoriesWithSettings)
          .run(connection);
        await connection.close();
        return result;
      } catch (err) {
        return err;
      }
    }
  }
};

export default CategoryQuery;
