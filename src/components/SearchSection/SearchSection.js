import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Pagination from 'rc-pagination';
import RaisedButton from 'material-ui/lib/raised-button';

const tabMapping = {
  ARTICLE: {title: 'Article'},
  FILE: {title: 'File'},
  WORKLOG: {title: 'Worklog'},
  COMMENT: {title: 'Comment'}
};
const DOCUMENT_URL_PREFIX = '/main/knowledge/document/';

let highlightKeyword = (content, keyword) => {
  let s = content.substr(0,300);
  let suffix = s===content ? '' : '...';
  s = s.replace(new RegExp(keyword, 'ig'), '<b style="color:red;background:yellow">$&</b>');
  return s + suffix;
};
let getContentWithoutMarkdown = (content) => {
  // no headline tag
  content = content
          .replace(/##### /g, '')
          .replace(/#### /g, '')
          .replace(/### /g, '')
          .replace(/## /g, '')
          .replace(/# /g, '');
  // no href tag AND convert linkText to pureText
  content = content.replace(/\[(.*?)]\(http.*?\)/g, '$1');
  // no code tag
  content = content.replace(/`/g, '');
  // no bold tag
  content = content.replace(/\*\*/g, '');
  return content;
};

export default class SearchSection extends Component {
  _renderDocType(docType) {
    let documentType = docType.toUpperCase();
    if (documentType==='BUGS') {
      documentType = 'BUG';
    }
    if (documentType==='KNOWLEDGES') {
      documentType = 'KNOWLEDGE';
    }
    return <span className="search-section-row__doctype">{'['+documentType+'] '}</span>;
  };
  _renderTags(aryTags, searchKeyword) {
    return (<span className="article-tag-list">{aryTags.map((tag)=>{
          return <span className="tag" dangerouslySetInnerHTML={{__html:highlightKeyword(tag, searchKeyword)}}></span>;
        })}</span>);
  };

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

    let contentStyle = {background:'#f0f0f0',padding:'9px'};
    let articleButtonProps = currentSearchTab==='ARTICLE' ? {secondary: true} : {};
    let fileButtonProps = currentSearchTab==='FILE' ? {secondary: true} : {};
    let worklogButtonProps = currentSearchTab==='WORKLOG' ? {secondary: true} : {};
    let commentButtonProps = currentSearchTab==='COMMENT' ? {secondary: true} : {};

    let tabLabelStyle = {'text-transform': 'none'};
    let subTitleStyle = {'text-align':'right'};
    subTitleStyle.display = searchResultTitle!=='' ? 'none' : 'none';

    return (
      <section className="search-section">
        <div className="search-section__header">
          <RaisedButton {...articleButtonProps}
            onClick={()=>{
              searchArticle(searchKeyword, pagesize, 0);
            }}  
            label="Article"
            labelStyle={tabLabelStyle} />
          <RaisedButton {...fileButtonProps}
            onClick={()=>{
              searchFile(searchKeyword, pagesize, 0);
            }}
            label="File"
            labelStyle={tabLabelStyle} />
          <RaisedButton {...worklogButtonProps}
            onClick={()=>{
              searchWorklog(searchKeyword, pagesize, 0);
            }}
            label="Work log"
            labelStyle={tabLabelStyle} />
          <RaisedButton {...commentButtonProps}
            onClick={()=>{
              searchComment(searchKeyword, pagesize, 0);
            }}
            label="Comment"
            labelStyle={tabLabelStyle} />
        </div>
        <div className="search-section__body">
          <div className="search-section__body-title" style={subTitleStyle}><span style={{color:'#aaa'}}>{searchResultTitle}</span> result for "<em>{searchKeyword}</em>":</div>
          <div className="search-section__body--article" style={articleBodyStyle}>
            <div className="search-section__body-nothing" style={{'display': !articleSearchResult || !articleSearchResult.length ? 'block' : 'none'}}>
            No article.
            </div>
            <ul className="search-section__body-list">{articleSearchResult.map((item, idx)=>{
              let _files = item._source && item._source.files;
              _files = _files || [];

              let articleContent = getContentWithoutMarkdown(item._source.content);

              return (<li key={idx} className="search-section-row search-section-row--article">
                <h4>{this._renderDocType(item._source.document_type)}<a href={DOCUMENT_URL_PREFIX + item._source.id} dangerouslySetInnerHTML={{__html:highlightKeyword(item._source.title, searchKeyword)}}></a></h4>
                <div style={contentStyle} dangerouslySetInnerHTML={{__html:highlightKeyword(articleContent||'', searchKeyword)}}></div>
                <div style={{color:'#9e9e9e', display:'none'}}>Author: {item._source.author_name}{' '}{moment(item._source.updated_at).format('YYYY-MM-DD')}</div>
                <ul style={{padding:'0'}}>
                  {_files.map((fileItem,fileIdx)=>{
                    return (<li key={fileIdx} style={{float:'left', margin:'0 9px 0 0', 'list-style':'none'}} title={fileItem.type}>
                    <a href={fileItem.url}>{fileItem.name}</a>
                    </li>);
                  })}
                </ul>
                {this._renderTags(item._source.tags, searchKeyword)}
              </li>);
            })}</ul>
          </div>
          <div className="search-section__body--file" style={fileBodyStyle}>
            <div className="search-section__body-nothing" style={{'display': !fileSearchResult || !fileSearchResult.length ? 'block' : 'none'}}>
            No file.
            </div>
            <ul className="search-section__body-list">{fileSearchResult.map((fileItem, idx)=>{
              let _source = fileItem._source;
              return (<li key={idx} className="search-section-row search-section-row--file" title={_source.type}>
                    <h4>{this._renderDocType(_source.article_document_type)}<a href={_source.url}>{_source.name}</a></h4>
                    <div style={{'text-align':'right',color:'#666'}}>{_source.article_title}{' '}<span dangerouslySetInnerHTML={{__html: ' - ' + moment(_source.created_at).format('YYYY-MM-DD')}}></span></div>
                    <div style={contentStyle} dangerouslySetInnerHTML={{__html:highlightKeyword(_source.content||'', searchKeyword)}}></div>
                    {_source.author_name + ': '}
                    {this._renderTags(_source.article_tags, searchKeyword)}
                  </li>);
            })}</ul>
          </div>
          <div className="search-section__body--worklog" style={worklogBodyStyle}>
            <div className="search-section__body-nothing" style={{'display': !worklogSearchResult || !worklogSearchResult.length ? 'block' : 'none'}}>
            No worklog.
            </div>
            <ul className="search-section__body-list">{worklogSearchResult.map((item, idx)=>{
              return <li key={idx}>{item._id}</li>;
            })}</ul>
          </div>
          <div className="search-section__body--comment" style={commentBodyStyle}>
            <div className="search-section__body-nothing" style={{'display': !commentSearchResult || !commentSearchResult.length ? 'block' : 'none'}}>
            No comment.
            </div>
            <ul className="search-section__body-list">{commentSearchResult.map((item, idx)=>{
              let _source = item._source;
              return (<li className="search-section-row search-section-row--comment" key={idx}>
                <h4>{this._renderDocType(_source.article_document_type)}
                {'Comment on: '}
                <a href={DOCUMENT_URL_PREFIX + _source.article_id} dangerouslySetInnerHTML={{__html:highlightKeyword(_source.article_title, searchKeyword)}}>
                </a>
                </h4>
                <div style={contentStyle} dangerouslySetInnerHTML={{__html:highlightKeyword(getContentWithoutMarkdown(_source.content)||'', searchKeyword)}}></div>
                {this._renderTags(_source.article_tags, searchKeyword)}
              </li>);
            })}</ul>
          </div>
        </div>
        <div className="search-section__footer">
          <div className="search-section__footer--article" style={articleFootStyle}>
            <Pagination onChange={(selected)=>{
              searchArticle(searchKeyword, pagesize, (selected-1)*pagesize);
            }} pageSize={pagesize} current={articleCurPage} total={articleTotal} />            
          </div>
          <div className="search-section__footer--file" style={fileFootStyle}>
            <Pagination onChange={(selected)=>{
              searchFile(searchKeyword, pagesize, (selected-1)*pagesize);
            }} pageSize={pagesize} current={fileCurPage} total={fileTotal} />
          </div>
          <div className="search-section__footer--worklog" style={worklogFootStyle}>
            <Pagination onChange={(selected)=>{
              searchWorklog(searchKeyword, pagesize, (selected-1)*pagesize);
            }} pageSize={pagesize} current={worklogCurPage} total={worklogTotal} />
          </div>
          <div className="search-section__footer--comment" style={commentFootStyle}>
            <Pagination onChange={(selected)=>{
              searchComment(searchKeyword, pagesize, (selected-1)*pagesize);
            }} pageSize={pagesize} current={commentCurPage} total={commentTotal} />
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
