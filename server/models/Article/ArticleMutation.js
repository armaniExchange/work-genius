// GraphQL
import {
  GraphQLID,
  GraphQLString,
} from 'graphql';
import ArticleType from './ArticleType.js';
import ArticleInputType from './ArticleInputType.js';

// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
// import moment from 'moment';

let ArticleMutation = {
  deleteArticle: {
    type: GraphQLString,
    description: 'Delete a article by its ID',
    args: {
      id: {
        type: GraphQLID,
        description: 'The article ID'
      }
    },
    resolve: async (root, { id }) => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        await r.db('work_genius')
          .table('articles')
          .get(id)
          .delete()
          .run(connection);
        await connection.close();
      } catch (err) {
        return err;
      }
      return 'Deleted successfully!';
    }
  },
  createArticle: {
    type: ArticleType,
    description: 'Create a new article ',
    args: {
      article: { type: ArticleInputType }
    },
    resolve: async (root, { article }) => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        let result = null;

        const user = root.req.decoded;
        const now = new Date().getTime();
        result = await r.db('work_genius')
          .table('articles')
          .insert({
            authorId: user.id,
            categoryId: article.category && article.category.id,
            commentsId: article.comments ? article.comments.map(comment => comment.id) : null,
            filesId: article.files ? article.files.map(file => file.id) : null,
            tags: article.tags,
            content: article.content,
            title: article.title,
            createdAt: now,
            updatedAt: now
          })
          .run(connection);

        if (result && result.generated_keys && result.generated_keys.length > 0) {
          const id = result.generated_keys[0];
          result = await r.db('work_genius')
            .table('articles')
            .get(id)
            .run(connection);
          await connection.close();
          // TODO: join the comments category author files table
          return result;
        } else {
          await connection.close();
          throw 'No generated_keys found';
        }
      } catch (err) {
        return err;
      }
    }
  },

  updateArticle: {
    type: ArticleType,
    description: 'edit a article ',
    args: {
      article: { type: ArticleInputType }
    },
    resolve: async (root, { article }) => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        let result = null;

        const now = new Date().getTime();
        await r.db('work_genius')
          .table('articles')
          .get(article.id)
          .update({
            categoryId: article.category && article.category.id,
            commentsId: article.comments ? article.comments.map(comment => comment.id) : null,
            filesId: article.files ? article.files.map(file => file.id) : null,
            tags: article.tags,
            content: article.content,
            title: article.title,
            category: article.category && article.category.id,
            updatedAt: now
          })
          .run(connection);

         result = await r.db('work_genius')
            .table('articles')
            .get(article.id)
            .run(connection);

        await connection.close();
        // TODO: join the comments category author files table
        return result;
      } catch (err) {
        return err;
      }
      return 'Edited successfully!';
    }
  }
};

export default ArticleMutation;
