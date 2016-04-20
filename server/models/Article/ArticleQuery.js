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

import { getChildren } from '../AssignmentCategory/utils.js';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

export const getArticleDetail = article => {
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
      .merge(comment => {
        return {
          author: dbWorkGenius.table('users').get(comment('authorId')).default(null),
        };
      })
      .coerceTo('array')
  };
};

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
    description: 'Get all articles with query',
    args: {
      categoryId: {
        type: GraphQLString,
        description: 'The category id for filtering articles'
      },
      authorId: {
        type: GraphQLString,
        description: 'The author of the article'
      },
      documentType: {
        type: GraphQLString,
        description: 'The document type of the article'
      },
      priority: {
        type: GraphQLString,
        description: 'The priority of the article'
      },
      milestone: {
        type: GraphQLString,
        description: 'The milestone of the article'
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
    resolve: async (root, {
      categoryId,
      authorId,
      documentType,
      priority,
      milestone,
      tag,
      page,
      pageLimit
    }) => {
      let result,
        connection = null,
        count = 0,
        allChildrenCategory = null,
        filterFunc = article => {
          let predicate = r.expr(true);
          if (categoryId) {
            predicate = predicate.and(r.expr([categoryId, ...allChildrenCategory]).contains(article('categoryId')));
          }
          if (tag) {
            predicate = predicate.and(article('tags').contains(tag));
          }
          return predicate;
        };

      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const query = r.db('work_genius').table('articles');

        page = page || 1;
        pageLimit = pageLimit || 5;

        if (categoryId){
          const queryCategories = r.db('work_genius')
            .table('categories')
            .coerceTo('array');
          result = await queryCategories.run(connection);
          allChildrenCategory = getChildren(result, {id: categoryId})
            .map(category => category.id);
        }

        let filterObj = {
          authorId,
          documentType,
          priority,
          milestone
        };
        Object.keys(filterObj)
          .forEach(key => {
            if (!filterObj[key]) { delete filterObj[key]; };
          });
        result = await query.filter(filterObj)
          .filter(filterFunc)
          .orderBy('updatedAt')
          .slice((page - 1) * pageLimit, page * pageLimit)
          .merge(getArticleDetail)
          .run(connection);

        if (!result ){
          throw 'No result';
        }

        count = await query.count().run(connection);
        await connection.close();
        return {
          articles: result,
          count
        };
      } catch (err) {
        await connection.close();
        return err;
      }
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
      let connection = null;
      let query = null, result = null;

      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        query = r.db('work_genius')
          .table('articles')
          .get(id);
        result = await query.merge(getArticleDetail).run(connection);
        await connection.close();
        return result;
      } catch (err) {
        await connection.close();
        return err;
      }
    }
  }
};

export default ArticleQuery;
