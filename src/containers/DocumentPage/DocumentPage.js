// Style
import './_DocumentPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import ArticleListItem from '../../components/ArticleListItem/ArticleListItem';

import * as DocumentActions from '../../actions/document-page-actions';

class DocumentPage extends Component {

  componentWillMount() {
    this.props.documentActions.fetchArticles();
  }

  _onCreateNewArticle() {
    location.href = '/main/article/edit/new';
  }

	render() {
    const leftPanelStyle = {
      width: '30%',
      float: 'left'
    };
    const rightPanelStyle = {
      width: '70%',
      float: 'left'
    };
    const {articleList} = this.props;
		return (
			<section>
        <div style={leftPanelStyle}>
          <button
            className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
            onClick={::this._onCreateNewArticle}>
            + Create a Document
          </button>
          <div className="mdl-textfield mdl-js-textfield">
             <input className="mdl-textfield__input" type="text" id="sample1" />
             <label className="mdl-textfield__label" htmlFor="sample1">Search...</label>
           </div>
          <div>
            <label>tag1</label>
            <label>tag2</label>
            <label>tag3</label>
          </div>
          <div>
            Tree structure here
          </div>
        </div>
        <div style={rightPanelStyle}>
          {
            articleList.map((article, id) => {
              return (
                <div key={id}>
                  <h1>{article.title}</h1>
                  <p>{article.content}</p>
                </div>
              );
            })
          }
        </div>
      </section>
		);
	}
}

DocumentPage.propTypes = {
  articleList: PropTypes.array,
  documentActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return state.documentation.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions: bindActionCreators(DocumentActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentPage);
