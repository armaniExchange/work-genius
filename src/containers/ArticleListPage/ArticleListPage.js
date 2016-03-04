// Style
import './_ArticleListPage.scss';
// React & Redux
import React, { Component } from 'react';

import ArticleListItem from '../../components/ArticleListItem/ArticleListItem';

class ArticleListPage extends Component {
	render() {
    const articles = [
      {
        id: '0',
        title: 'first article',
        author: {
          id: '0',
          name: 'fong'
        },
        tags: [ 'tag1', 'tag2' ],
        attachments: [],
        comments: [],
        content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
        createdAt: 1457085436639,
        updatedAt: 1457085446639,
      },
      {
        id: '1',
        title: 'second article',
        author: {
          id: '1',
          name: 'steven'
        },
        tags: [ 'tag1', 'tag2' ],
        attachments: [],
        comments: [],
        content: '# markdown test',
        createdAt: 1457085426639,
        updatedAt: 1457085466639,
      }
    ];
		return (
			<section>
        {
          articles.map((article, id) => {
            return (<ArticleListItem key={id} {...article} />);
          })
        }
      </section>
		);
	}
}

export default ArticleListPage;
