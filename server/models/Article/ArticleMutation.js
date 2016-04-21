// GraphQL
import {
  GraphQLID,
  GraphQLString,
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';

import ArticleType from './ArticleType.js';
import ArticleInputType from './ArticleInputType.js';

// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

import { deleteFile } from '../File/FileMutation';
import { getArticleDetail } from './ArticleQuery';

const parseArticle = (article) => {
  // only update give article property, if it didn't pass, keep original property
  // ex: article = {id: '123', files: ['567']}
  // didn't provided category, then result shouldn't contain category property
  let result = {};

  Object.keys(article)
    .map( key => {
      switch (key) {
        case 'category':
          result.categoryId = article.category.id;
          break;
        case 'comments':
          result.commentsId = article.comments.map(comment => comment.id);
          break;
        case 'files':
          result.filesId = article.files.map(file => file.id);
          break;
        case 'tags':
          result.tags = article.tags || [];
          break;
        default:
          result[key] = article[key];
          break;
      }
    });
  return result;
};

const ArticleMutation = {
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
      let connection = null;
      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const deletingFiles = await r.db('work_genius')
          .table('articles')
          .get(id)
          .getField('filesId')
          .run(connection);

        // TODO: rewrite this into parallel form
        for (let i = 0, l = deletingFiles.length; i < l ; i++) {
          await deleteFile(deletingFiles[i]);
        }

        const deletingComments = await r.db('work_genius')
          .table('articles')
          .get(id)
          .getField('commentsId')
          .default(['prevent-empty-error'])
          .run(connection);

        await r.db('work_genius')
          .table('comments')
          .getAll(r.args(deletingComments))
          .delete()
          .run(connection);

        await r.db('work_genius')
          .table('articles')
          .get(id)
          .delete()
          .run(connection);

        await connection.close();
      } catch (err) {
        await connection.close();
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
      let connection = null, result = null;
      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const user = root.req.decoded;
        const now = new Date().getTime();
        const parsedArticle = Object.assign({}, parseArticle(article), {
          authorId: user.id,
          createdAt: now,
          updatedAt: now
        });

        result = await r.db('work_genius')
          .table('articles')
          .insert(parsedArticle)
          .run(connection);

        if (result && result.generated_keys && result.generated_keys.length > 0) {
          const id = result.generated_keys[0];
          result = await r.db('work_genius')
            .table('articles')
            .get(id)
            .merge(getArticleDetail)
            .run(connection);
          await connection.close();
          return result;
        } else {
          throw 'No generated_keys found';
        }
      } catch (err) {
        await connection.close();
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
      let connection = null, result = null;

      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });

        const parsedArticle = Object.assign({}, parseArticle(article), {
          updatedAt: new Date().getTime()
        });

        await r.db('work_genius')
          .table('articles')
          .get(article.id)
          .update(parsedArticle)
          .run(connection);

        result = await r.db('work_genius')
          .table('articles')
          .get(article.id)
          .merge(getArticleDetail)
          .run(connection);

        await connection.close();
        return result;
      } catch (err) {
        await connection.close();
        return err;
      }
      return 'Edited successfully!';
    }
  }
};

export default ArticleMutation;
