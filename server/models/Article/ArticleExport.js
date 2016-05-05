import markdownpdf from 'markdown-pdf';
import streamifier from 'streamifier';
// RethinkDB
import r from 'rethinkdb';
import moment from 'moment';

// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

export const articleExportHandler = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const result = await r.db('work_genius')
      .table('articles')
      .get(articleId)
      .merge((article) => {
        return {
          author: r.db('work_genius').table('users').get(article('authorId')).default(null)
        };
      })
      .run(connection);
    await connection.close();

    const userAgent = (req.headers['user-agent']||'').toLowerCase();
    const filename = `${result.title}.pdf`;
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
    } else if (userAgent.indexOf('firefox') >= 0) {
        res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
    } else {
        /* safari and other browser */
        res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
    }

    res.setHeader('Content-type', 'application/pdf');

    const {
      title,
      author,
      content,
      updatedAt
    } = result;

    markdownpdf({
        cssPath: 'server/libraries/github-markdown.css'
      })
      .from.string(`# ${title}\n<small>Author: ${author.name} <span style="color:gray">${moment(updatedAt).format('YYYY-MM-DD hh:mm')}</span></small>\n\n${content}`)
      .to.buffer((err, buffer) => {
        if (err) { throw err; }
        streamifier.createReadStream(buffer).pipe(res);
      });
  } catch (error) {
    res.status(error.status)
      .send({error: error});
  }

};
