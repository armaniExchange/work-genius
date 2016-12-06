// GraphQL
import {
  GraphQLID,
  GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';

import ArticleType from './ArticleType.js';
import ArticleInputType from './ArticleInputType.js';

// Constants
import { DB_HOST, DB_PORT, MAILER_ADDRESS, MAIL_CC_LIST } from '../../constants/configurations.js';

import { deleteFile } from '../File/FileMutation';
import { getArticleDetail } from './ArticleQuery';
import { SERVER_HOST } from '../../../src/constants/config';
import generateEmailMarkdown from '../../libraries/generateEmailMarkdown';
import parseMarkdown from '../../libraries/parseMarkdown';

const parseArticle = (article) => {
  // only update give article property, if it didn't pass, keep original property
  // ex: article = {id: '123', files: ['567']}
  // didn't provided categoryId, then result shouldn't contain categoryId property
  let result = {};
  Object.keys(article)
    .filter(key => key !== 'updateTestReportUt')
    .map( key => {
      switch (key) {
        case 'comments':
          result.commentsId = article.comments.map(comment => comment.id);
          break;
        case 'files':
          result.filesId = article.files.map(file => file.id);
          break;
        case 'tags':
          result.tags = article.tags || [];
          break;
        case 'reportTo':
          result.reportTo = article.reportTo || [];
          break;
        default:
          result[key] = article[key];
          break;
      }
    });
  return result;
};

export const getArticleLink = (articleId) => {
  return `http://${SERVER_HOST}/main/knowledge/document/${articleId}`;
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
          .default(null)
          .run(connection);

        if (deletingFiles) {
          // TODO: rewrite this into parallel form
          for (let i = 0, l = deletingFiles.length; i < l ; i++) {
            await deleteFile(deletingFiles[i]);
          }
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

        await r.db('work_genius').table('document_categories')
          .get(
            r.db('work_genius').table('articles')
              .get(id)
              .getField('categoryId')
          ).update({articlesCount: r.row('articlesCount').sub(1)})
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
    resolve: async ({ req, transporter }, { article }) => {
      let connection = null, result = null;
      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        const user = req.decoded;
        const now = new Date().getTime();
        const parsedArticle = Object.assign({
          tags: [],
          reportTo: [],
          files: [],
        }, parseArticle(article), {
          authorId: user.id,
          createdAt: now,
          updatedAt: now
        }, article.documentType === 'bugs' ? {
          bugStatus: 'new'
        }: null);

        if (!parsedArticle.content ) {
          const template = await r.db('work_genius')
            .table('document_templates')
            .get(article.documentType)
            .run(connection);
          parsedArticle.content = template.content;
        }

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

          await r.db('work_genius').table('document_categories').get(
            r.db('work_genius').table('articles')
              .get(id)
              .getField('categoryId')
          ).update({articlesCount: r.row('articlesCount').add(1)})
          .run(connection);

          if (article.updateTestReportUt) {
            await r.db('work_genius')
              .table('test_report_categories')
              .get(article.categoryId)
              .update({ UTDoc: id })
              .run(connection);
          }

          if (article.updateCheckListBug) {
            await r.db('work_genius')
              .table('test_report_categories')
              .get(article.categoryId)
              .update({
                checkList: r.row('checkList')
                  .map(checkItem=>{
                    return r.branch(checkItem('id').eq(article.checkListId),
                      checkItem.merge({ bugArticle: id }),
                      checkItem);
                  })
              })
              .run(connection);
          }

          await connection.close();

          if (article.documentType !== 'test case') {
            // skip test case
            await transporter.sendMail({
              from: MAILER_ADDRESS,
              to: result.reportTo.map((emailName) => `${emailName}@a10networks.com`),
              subject: `[KB - New Document] ${result.title}`,
              html: parseMarkdown(generateEmailMarkdown({
                to: 'teams',
                beginning: `Thanks ${user.name} for sharing the knowledge on KB.`,
                url: getArticleLink(id),
                title: result.title,
                content: result.content
              })),
              cc: MAIL_CC_LIST
            });
          } else {
            console.log('skip test case email');
          }

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
    resolve: async ({ req, transporter }, { article }) => {
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
