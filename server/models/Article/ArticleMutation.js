// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import moment from 'moment';

let ArticleMutation = {
  'deleteArticle': {
    type: GraphQLString,
    description: 'Delete a article by its ID',
    args: {
      id: {
        type: GraphQLID,
        description: 'The article ID'
      }
    },
    resolve: async (root, { id }) => {
      let connection = null,
        query = null;

      try {
        query = r.db('work_genius').table('articles').get(id).delete();
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        await query.run(connection);
        await connection.close();
      } catch (err) {
        return err;
      }
      return 'Deleted successfully!';
    }
  },
  'createArticle': {
    type: GraphQLString,
    description: 'Create a article ',
    args: {
      data: {
        type: GraphQLString,
        description: 'new article data'
      }
    },
    resolve: async (root, { data }) => {
      let connection = null,
        query = null;

      try {
        let article = JSON.parse(data);
        if(article){
          article.created_time = moment().format('YYYY/MM/DD');
        }
        query = r.db('work_genius').table('articles').insert(article);
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        let result = await query.run(connection);
        await connection.close();
        let id = '';
        if (result && result.generated_keys && result.generated_keys.length > 0){
          id = result.generated_keys[0];
        }
        return id;
      } catch (err) {
        return err;
      }
    }
  },
  'updateArticle': {
    type: GraphQLString,
    description: 'edit a article ',
    args: {
      data: {
        type: GraphQLString,
        description: 'new article data'
      },
      id: {
        type: GraphQLID,
        description: 'the article id'
      }
    },
    resolve: async (root, { data , id }) => {
      let connection = null,
        query = null;

      try {
        let article = JSON.parse(data);
        if(article){
          article.updated_time = moment().format('YYYY/MM/DD');
        }
        query = r.db('work_genius').table('articles').get(id).update(article);
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        await query.run(connection);
        await connection.close();
        return id;
      } catch (err) {
        return err;
      }
      return 'Edited successfully!';
    }
  }

};

export default ArticleMutation;
