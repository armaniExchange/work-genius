// GraphQL
import {
    GraphQLID,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT, MAILER_ADDRESS } from '../../constants/configurations.js';
import { getArticleLink } from '../Article/ArticleMutation';
import generateEmailMarkdown from '../../libraries/generateEmailMarkdown';
import parseMarkdown from '../../libraries/parseMarkdown';
import CommentType from './CommentType.js';
import CommentInputType from './CommentInputType.js';

const CommentMutation = {
  deleteComment: {
    type: GraphQLString,
    description: 'Delete a comment by it\'s ID',
    args: {
      id: {
        type: GraphQLID,
        description: 'The comment ID'
      },
      articleId: {
        type: GraphQLID,
        description: 'The article ID'
      }
    },
    resolve: async (root, { id, articleId }) => {
      let connection = null, query = null;

      try {
        connection = await r.connect({ host: DB_HOST, port: DB_PORT });

        if (articleId) {
          await r.db('work_genius')
            .table('articles')
            .get(articleId)
            .update({
              comments: r.row('comments').filter(comment => comment.id !== id )
            });
        }
        query = r.db('work_genius').table('comments').get(id).delete();
        await query.run(connection);
        await connection.close();
      } catch (err) {
        return err;
      }
      return 'Deleted successfully!';
    }
  },

  createComment: {
    type: CommentType,
    description: 'Create a new comment',
    args: {
      comment: { type: CommentInputType },
      articleId: {
        type: GraphQLID,
        description: 'The article ID'
      }
    },
    resolve: async ({ req, transporter }, { comment, articleId }) => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        let result = null;
        const user = req.decoded;
        const now = new Date().getTime();

        result = await r.db('work_genius')
          .table('comments')
          .insert({
            authorId: user.id,
            content: comment.content,
            createdAt: now,
            updatedAt: now
          })
          .run(connection);

        if (result && result.generated_keys && result.generated_keys.length > 0) {
          const id = result.generated_keys[0];

          if (articleId) {
            await r.db('work_genius')
              .table('articles')
              .get(articleId)
              .update({
                commentsId: r.row('commentsId').default([]).append(id)
              })
              .run(connection);
            const commentedArticle = await r.db('work_genius')
              .table('articles')
              .get(articleId)
              .merge(article => {return {author: r.db('work_genius').table('users').get(article('authorId')).default(null)};})
              .run(connection);
            if (process.env.NODE_ENV === 'production') {
              await transporter.sendMail({
                from: MAILER_ADDRESS,
                to: [commentedArticle.author.email, ...(commentedArticle.reportTo.map((emailName) => `${emailName}@a10networks.com`))],
                subject: `[KB New Comment] ${commentedArticle.title} `,
                html: parseMarkdown(generateEmailMarkdown({
                  to: commentedArticle.author.name,
                  beginning: `${user.name} commented your document on KB.`,
                  url: getArticleLink(articleId),
                  title: commentedArticle.title,
                  content: comment.content
                })),
                cc: 'ax-web-DL@a10networks.com'
              });
            }
          }

          result = await r.db('work_genius')
            .table('comments')
            .get(id)
            .merge(commentItem => {
              return {
                author: r.db('work_genius').table('users').get(commentItem('authorId')).default(null),
              };
            })
            .run(connection);
          await connection.close();

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

  updateComment: {
    type: CommentType,
    description: 'Update a comment',
    args: {
      comment: { type: CommentInputType },
      articleId: {
        type: GraphQLID,
        description: 'The article ID'
      }
    },
    resolve: async ({ req, transporter }, { comment, articleId }) => {
      try {
        const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
        let result = null;
        const now = new Date().getTime();

        result = await r.db('work_genius')
          .table('comments')
          .get(comment.id)
          .update({
            content: comment.content,
            updatedAt: now
          })
          .run(connection);

        result = await r.db('work_genius')
          .table('comments')
          .get(comment.id)
          .merge(commentItem => {
            return {
              author: r.db('work_genius').table('users').get(commentItem('authorId')).default(null),
            };
          })
          .run(connection);
        await connection.close();

        return result;

      } catch (err) {
        return err;
      }
    }
  },
};

export default CommentMutation;
