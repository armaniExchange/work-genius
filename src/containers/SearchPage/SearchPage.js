// Style
import './_SearchPage.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as SearchPageActions from '../../actions/search-page-actions';
import * as mainActions from '../../actions/main-actions';

import Pagination from 'rc-pagination';

const tabMapping = {
  ARTICLE: {title: 'Article'},
  FILE: {title: 'File'},
  WORKLOG: {title: 'Worklog'},
  COMMENT: {title: 'Comment'}
};
const DOCUMENT_URL_PREFIX = '/main/knowledge/document/';

class SearchPage extends Component {
  render() {
    let { 
        searchKeyword,
        currentSearchTab,
        pagesize,

        articleSearchResult,
        articleTotal,
        articleCurPage,
        fileSearchResult,
        fileTotal,
        fileCurPage,
        worklogSearchResult,
        worklogTotal,
        worklogCurPage,
        commentSearchResult,
        commentTotal,
        commentCurPage,

        searchArticle
        } = this.props;

    let searchResultTitle = tabMapping[currentSearchTab] ? tabMapping[currentSearchTab].title : '';

    let articleBodyStyle = {};
    let fileBodyStyle = {};
    let worklogBodyStyle = {};
    let commentBodyStyle = {};
    let articleFootStyle = {};
    let fileFootStyle = {};
    let worklogFootStyle = {};
    let commentFootStyle = {};
    if (currentSearchTab!=='ARTICLE') {
      articleBodyStyle.display = articleFootStyle.display = 'none';
    }
    if (currentSearchTab!=='FILE') {
      fileBodyStyle.display = fileFootStyle.display = 'none';
    }
    if (currentSearchTab!=='WORKLOG') {
      worklogBodyStyle.display = worklogFootStyle.display = 'none';
    }
    if (currentSearchTab!=='COMMENT') {
      commentBodyStyle.display = commentFootStyle.display = 'none';
    }
    return (
      <section className="search-section">
        <div className="search-section__header">
          Toggle: <button type="button" onClick={()=>{
            searchArticle('knowledges', pagesize, 0);
          }}>Knowledge</button>
          <button type="button" onClick={()=>{

          }}>Files</button>
        </div>
        <div className="search-section__body">
          {searchResultTitle} Result for "{searchKeyword}":
          <div className="search-section__body--article" style={articleBodyStyle}>
            {!articleSearchResult || !articleSearchResult.length ? 'No article.' : ''}
            <ul>{articleSearchResult.map((item, idx)=>{
              let _files = item._source && item._source.files;
              _files = _files || [];

              return (<li key={idx} className="search-section-row search-section-row--article">
                <h4><a href={DOCUMENT_URL_PREFIX + item._source.id}>{item._source.title}</a></h4>
                <div>{moment(item._source.updated_at).format('YYYY-MM-DD')}{' '}{'['+item._source.document_type+']'}</div>
                <div style={{background:'#dfdfdf',padding:'9px'}}>{(item._source.content||'').substr(0,300) + '...'}</div>
                <div>Author: {item._source.author_name}</div>
                <ul>
                  {_files.map((fileItem,fileIdx)=>{
                    return (<li key={fileIdx} title={fileItem.type}>
                    <a href={fileItem.url}>{fileItem.name}</a>
                    </li>);
                  })}
                </ul>
              </li>);
            })}</ul>
          </div>
          <div className="search-section__body--file" style={fileBodyStyle}>
            {!fileSearchResult || !fileSearchResult.length ? 'No file.' : ''}
            <ul>{fileSearchResult.map((fileItem, idx)=>{
              return (<li key={idx} title={fileItem.type}>
                    <a href={fileItem.url}>{fileItem.name}</a>
                  </li>);
            })}</ul>
          </div>
          <div className="search-section__body--worklog" style={worklogBodyStyle}>
            {!worklogSearchResult || !worklogSearchResult.length ? 'No worklog.' : ''}
            <ul>{worklogSearchResult.map((item, idx)=>{
              return <li key={idx}>{item._id}</li>;
            })}</ul>
          </div>
          <div className="search-section__body--comment" style={commentBodyStyle}>
            {!commentSearchResult || !commentSearchResult.length ? 'No comment.' : ''}
            <ul>{commentSearchResult.map((item, idx)=>{
              return <li key={idx}>{item._id}</li>;
            })}</ul>
          </div>
        </div>
        <div className="search-section__footer">
          <div className="search-section__footer--article" style={articleFootStyle}>
            <Pagination onChange={(selected, b, c)=>{
              searchArticle(searchKeyword, pagesize, (selected-1)*pagesize);
            }} pageSize={pagesize} current={articleCurPage} total={articleTotal} />            
          </div>
          <div className="search-section__footer--file" style={fileFootStyle}>
            <Pagination onChange={this._onClickFilePaginate} pageSize={pagesize} current={fileCurPage} total={fileTotal} />
          </div>
          <div className="search-section__footer--worklog" style={worklogFootStyle}>
            <Pagination onChange={this._onClickWorklogPaginate} pageSize={pagesize} current={worklogCurPage} total={worklogTotal} />
          </div>
          <div className="search-section__footer--comment" style={commentFootStyle}>
            <Pagination onChange={this._onClickCommentPaginate} pageSize={pagesize} current={commentCurPage} total={commentTotal} />
          </div>
        </div>
      </section>
    );
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
