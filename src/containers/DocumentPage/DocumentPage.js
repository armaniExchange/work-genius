// Style
import './_DocumentPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

import ArticleListItem from '../../components/ArticleListItem/ArticleListItem';
import ArticleTagList from '../../components/ArticleTagList/ArticleTagList';
import CategoryTree from '../../components/CategoryTree/CategoryTree';

import * as DocumentActions from '../../actions/document-page-actions';

class DocumentPage extends Component {

  componentWillMount() {
    const {
      fetchArticles,
      fetchCategories,
      fetchAllTags
    } = this.props.documentActions;
    fetchArticles();
    fetchCategories();
    fetchAllTags();
  }

  onCreateNewArticle() {
    location.href = '/main/articles/edit/new';
  }

  queryWithTag(tag) {
    this.props.documentActions.fetchArticles({tag: tag});
  }

  onSearchChange(event) {
    this.props.documentActions.fetchArticles({
      q: event.target.value
    });
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
    const {
      articleList,
      tags,
      categories
    } = this.props;

		return (
			<section>
        <div style={leftPanelStyle}>
          <RaisedButton
            label="+ Create a Document"
            secondary={true}
            onClick={::this.onCreateNewArticle} />
          <br />
          <TextField
            hintText="Search..."
            onChange={::this.onSearchChange} />
          <br/>
          <ArticleTagList tags={tags} onClick={::this.queryWithTag} />
          <div>
            <h5>Tree</h5>
            <CategoryTree categories={categories} />
          </div>
        </div>
        <div style={rightPanelStyle}>
          {
            articleList.map((article, id) => {
              return (
                <ArticleListItem key={id}
                  {...article}/>
              );
            })
          }
        </div>
      </section>
		);
	}
}

DocumentPage.propTypes = {
  articleList            : PropTypes.array,
  categories             : PropTypes.array,
  tags                   : PropTypes.array,
  documentActions        : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return state.documentation.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions     : bindActionCreators(DocumentActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentPage);
