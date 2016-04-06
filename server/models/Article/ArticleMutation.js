// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let ArticleMutation = {
  'deleteArticle': {
    type: GraphQLString,
    description: 'Delete a article by its ID',
    args: {
      articleId: {
        type: GraphQLID,
        description: 'The article ID'
      }
    },
    resolve: async (root, { articleId }) => {
      let connection = null,
        query = null;

      try {
        query = r.db('work_genius').table('articles').get(articleId).delete();
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
        query = r.db('work_genius').table('articles').insert(JSON.parse(data));
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
  'editArticle': {
    type: GraphQLString,
    description: 'edit a article ',
    args: {
      data: {
        type: GraphQLString,
        description: 'new article data'
      },
      articleId: {
        type: GraphQLString,
        description: 'the article id'
      }
    },
    resolve: async (root, { data , articleId }) => {
      let connection = null,
        query = null;

      try {
        query = r.db('work_genius').table('articles').get(articleId).update(JSON.parse(data));
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        await query.run(connection);
        await connection.close();
        return articleId;
      } catch (err) {
        return err;
      }
      return 'Edited successfully!';
    }
  }

};

export default ArticleMutation;
