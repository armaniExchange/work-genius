// GraphQL
import {
  GraphQLList,
  GraphQLString
} from 'graphql';
// Models
import CategoryType from './CategoryType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
// Utils
import { transformToTree, generatePath, dedupe } from './utils.js';
import _ from 'lodash';

let CategoryQuery = {
  'getAllCategories': {
    type: new GraphQLList(CategoryType),
    description: 'Get all documentation categories',
    resolve: async () => {
      let connection = null,
          result = null,
        query = null;

      try {
        query = r.db('work_genius').table('categories').coerceTo('array');
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        result = await query.run(connection);
        result = result.map((category, index, arr) => {
          return {
            ...category,
            path: generatePath(arr, category.id)
          };
        });

        result = _.sortBy(result, category => {
          return category.path;
        });
        await connection.close();
      } catch (err) {
        return err;
      }
      return result;
    }
  },
    'getCategoryTree': {
    type: CategoryType,
    description: 'Get all documentation categories in tree form',
    resolve: async () => {
      let connection = null,
          result = null,
        query = null;

      try {
        query = r.db('work_genius').table('categories').coerceTo('array');
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        result = await query.run(connection);
                result = transformToTree(result);
        await connection.close();
      } catch (err) {
        return err;
      }
      return result;
    }
  },
  'getHotTags': {
    type: new GraphQLList(GraphQLString),
    description: 'Get all documentation tags',
    resolve: async () => {
      let connection = null,
          result = null;

      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        result = await r.db('work_genius').table('articles').map(r.row('tags'))
          .reduce((left, right)=> left.add(right))
          .map((item)=>({tag: item}))
          .group('tag')
          .count()
          .ungroup()
          .orderBy(r.desc('reduction'))
          .map(r.row('group'))
          .slice(0, 30)
          .run(connection);

        await connection.close();
      } catch (err) {
        return err;
      }
      return result;
    }
  },
  'getAllMilestones': {
    type: new GraphQLList(GraphQLString),
    description: 'Get all documentation milestone',
    resolve: async () => {
      let connection = null,
          result = null,
        query = null;

      try {
        query = r.db('work_genius').table('articles')('milestone').distinct();
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        result = await query.run(connection);
        result = result.filter(item =>  item.trim() !== '');
        await connection.close();
      } catch (err) {
        return err;
      }
      return result;
    }
  }
};


export default CategoryQuery;
