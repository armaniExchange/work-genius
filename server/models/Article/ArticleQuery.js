// Models
import ArticleType from './ArticleType.js';
// GraphQL
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

function _getArticleDetail(article){
  const dbWorkGenius = r.db('work_genius');
  return {
    author: dbWorkGenius.table('users').get(article('authorId')).default(null),
    category: dbWorkGenius.table('categories').get(article('categoryId')).default(null),
    files: dbWorkGenius.table('files')
      .getAll(
        r.args(article('filesId').default([]).coerceTo('array').append('prevent-empty-error'))
      )
      .coerceTo('array'),
    comments: dbWorkGenius.table('comments')
      .getAll(
        r.args(article('commentsId').default([]).coerceTo('array').append('prevent-empty-error'))
      )
      .coerceTo('array')
  };
}

let ArticleQuery = {
  getAllArticles : {
    type: new GraphQLObjectType({
      name: 'GetAllArticles',
      fields: () => ({
        articles: {
          type: new GraphQLList(ArticleType)
        },
        count: {
          type: GraphQLFloat
        }
      })
    }),
    description: 'Get all articles under the selected category',
    args: {
      categoryId: {
        type: GraphQLString,
        description: 'The category id for filtering articles'
      },
      authorId: {
        type: GraphQLString,
        description: 'The author of the article'
      },
      tag: {
        type: GraphQLString,
        description: 'The tag of the article'
      },
      page: {
        type: GraphQLInt,
        description: 'page'
      },
      pageLimit: {
        type: GraphQLInt,
        description: 'argument specifies the number of pages you’d like to get.'
      }
    },
    resolve: async (root, { categoryId, authorId, tag, page, pageLimit}) => {
      let  result,
        count = 0,
        filterFunc = article => {
          return (!authorId || article('authorId') === authorId)
            && (!categoryId || article('categoryId') === categoryId)
            && (!tag || article('tags').contains(tag));
        };

      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        page = page || 1;
        pageLimit = pageLimit || 5;
        let query = r.db('work_genius')
          .table('articles')
          .filter(filterFunc)
          .orderBy('updatedAt');
        result = await query
          .slice((page - 1) * pageLimit, page * pageLimit)
          .merge(_getArticleDetail).run(connection);

        if (!result ){
          throw 'No result';
        }

        count = await query.count().run(connection);

        await connection.close();
      } catch (err) {
        return err;
      }
      return {
        articles: result,
        count
      };
    }
  },

  getArticle:{
    type: ArticleType,
    description: 'Get single article by article id ',
    args: {
      id: {
        type: GraphQLID,
        description: 'Article ID'
      }
    },
    resolve: async (root, {id}) => {
      const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
      let query = null, result = null;

      try {
        query = r.db('work_genius')
          .table('articles')
          .get(id);
        result = await query.merge(_getArticleDetail).run(connection);
        await connection.close();
      } catch (err) {
        return err;
      }
      return result;
    }
  }
};

export default ArticleQuery;
