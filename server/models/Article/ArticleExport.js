import markdownpdf from 'markdown-pdf';
import streamifier from 'streamifier';
// RethinkDB
import r from 'rethinkdb';
import moment from 'moment';
import { getArticleDetail } from './ArticleQuery';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

function getContentDisposition(userAgent, filename) {

  if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
      return `attachment; filename=${encodeURIComponent(filename)}`;
  } else if (userAgent.indexOf('firefox') >= 0) {
      return `attachment; filename*="utf8'' ${encodeURIComponent(filename)}"`;
  } else {
      /* safari and other browser */
      return `attachment; filename=${new Buffer(filename).toString('binary')}`;
  }
}

export const articleExportHandler = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const withComments = req.query.withComments || false;
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const result = await r.db('work_genius')
      .table('articles')
      .get(articleId)
      .merge(getArticleDetail)
      .run(connection);
    await connection.close();

    const userAgent = (req.headers['user-agent']||'').toLowerCase();
    const filename = `${result.title}.pdf`;

    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Content-Disposition', getContentDisposition(userAgent, filename));

    const {
      title,
      author,
      content,
      updatedAt,
      comments
    } = result;
    const header = `# ${title}\n<small>Author: ${author.name} <span style="color:gray">${moment(updatedAt).format('YYYY-MM-DD hh:mm')}</span></small>\n`;
    const commentsString = withComments ? comments.map((comment) => {
        comment.author = comment.author || { name: 'unknown' };
        return `\n<hr />\n<small>Author: ${comment.author.name} <span style="color:gray">${moment(comment.updatedAt).format('YYYY-MM-DD hh:mm')}</span></small>\n\n${comment.content}\n`;
      })
      .reduce((prev, current) => prev + current, `\n# Comments\n`) : '';

    markdownpdf({
        cssPath: 'server/libraries/github-markdown.css'
      })
      .from.string(`${header}\n\n${content}\n\n${commentsString}`)
      .to.buffer((err, buffer) => {
        if (err) { throw err; }
        streamifier.createReadStream(buffer).pipe(res);
      });
  } catch (error) {
    res.status(error.status)
      .send({error: error});
  }

};
