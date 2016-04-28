import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Pagination from 'rc-pagination';

const tabMapping = {
  ARTICLE: {title: 'Article'},
  FILE: {title: 'File'},
  WORKLOG: {title: 'Worklog'},
  COMMENT: {title: 'Comment'}
};
const DOCUMENT_URL_PREFIX = '/main/knowledge/document/';

let highlightKeyword = (content, keyword) => {
  let s = content.substr(0,300);
  s = s.replace(new RegExp(keyword, 'ig'), '<b style="color:red;background:yellow">$&</b>');
  return s + '...';
};

export default class SearchSection extends Component {
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

        searchArticle,
        searchFile,
        searchWorklog,
        searchComment
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

    if (articleTotal<=pagesize) {
      articleFootStyle.display = 'none';
    }
    if (fileTotal<=pagesize) {
      fileFootStyle.display = 'none';
    }
    if (worklogTotal<=pagesize) {
      worklogFootStyle.display = 'none';
    }
    if (commentTotal<=pagesize) {
      commentFootStyle.display = 'none';
    }

    let contentStyle = {background:'#dfdfdf',padding:'9px'};

    return (
      <section className="search-section">
        <div className="search-section__header">
          Toggle: <button type="button" onClick={()=>{
            searchArticle('ajax', pagesize, 0);
          }}>Knowledge</button>
          <button type="button" onClick={()=>{
            searchFile('with', pagesize, 0);
          }}>Files</button>
        </div>
        <div className="search-section__body">
          <h3><span style={{color:'#aaa'}}>{searchResultTitle}</span> result for "<em>{searchKeyword}</em>":</h3>
          <div className="search-section__body--article" style={articleBodyStyle}>
            {!articleSearchResult || !articleSearchResult.length ? 'No article.' : ''}
            <ul>{articleSearchResult.map((item, idx)=>{
              let _files = item._source && item._source.files;
              _files = _files || [];

              return (<li key={idx} className="search-section-row search-section-row--article">
                <h4><a href={DOCUMENT_URL_PREFIX + item._source.id} dangerouslySetInnerHTML={{__html:highlightKeyword(item._source.title, searchKeyword)}}></a></h4>
                <div>{moment(item._source.updated_at).format('YYYY-MM-DD')}{' '}{'['+item._source.document_type+']'}</div>
                <div style={contentStyle} dangerouslySetInnerHTML={{__html:highlightKeyword(item._source.content||'', searchKeyword)}}></div>
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
              let _source = fileItem._source;
              return (<li key={idx} className="search-section-row search-section-row--file" title={_source.type}>
                    <h4><a href={_source.url}>{_source.name}</a></h4>
                    <div style={contentStyle} dangerouslySetInnerHTML={{__html:highlightKeyword(_source.content||'', searchKeyword)}}></div>
                    <div>{moment(_source.created_at).format('YYYY-MM-DD')}{' '}{'['+_source.article_document_type+']'}</div>
                    <div>In document:{' '}{_source.article_title}{' ['}{_source.article_tags.join(',')}{'] '}{' '}<i>{_source.author_name}</i></div>
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

SearchSection.propTypes = {
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
SearchSection.defaultProps = {
  searchKeyword: '',
  articleSearchResult: [],
  commentSearchResult: [],
  fileSearchResult: [],
  worklogSearchResult: []
};
