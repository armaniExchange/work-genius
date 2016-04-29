// Style
import './_SearchPage.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
//import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as SearchPageActions from '../../actions/search-actions';

import SearchSection from '../../components/SearchSection/SearchSection';

class SearchPage extends Component {
  render() {
    return <SearchSection {...this.props} />;
  }
}

SearchPage.propTypes = {
  searchKeyword: PropTypes.string,
  currentSearchTab: PropTypes.string,
  pagesize: PropTypes.number,

  articleSearchResult: PropTypes.array,
  articleTotal: PropTypes.number,
  articleCurPage: PropTypes.number,
  fileSearchResult: PropTypes.array,
  fileTotal: PropTypes.number,
  fileCurPage: PropTypes.number,
  worklogSearchResult: PropTypes.array,
  worklogTotal: PropTypes.number,
  worklogCurPage: PropTypes.number,
  commentSearchResult: PropTypes.array,
  commentTotal: PropTypes.number,
  commentCurPage: PropTypes.number,
  articleSearchResult: PropTypes.array,
  commentSearchResult: PropTypes.array,
  fileSearchResult: PropTypes.array,
  worklogSearchResult: PropTypes.array,

  searchArticle: PropTypes.func,
  searchFile: PropTypes.func,
  searchWorklog: PropTypes.func,
  searchComment: PropTypes.func,
};
SearchPage.defaultProps = {
  searchKeyword: '',
  articleSearchResult: [],
  commentSearchResult: [],
  fileSearchResult: [],
  worklogSearchResult: []
};


function mapStateToProps(state) {
    return Object.assign(
        {},
        state.search.toJS(),
        state.app.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(SearchPageActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchPage);
