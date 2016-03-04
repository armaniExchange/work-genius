// Style
import './_ArticlePage.scss';
// React & Redux
import React, { Component } from 'react';
import Markdown from 'react-markdown';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/lib/codemirror.css';

class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '# this is a test \n * 1 \n * 2 \n ```js \nfunction(){\n  console.log("test"); \n}\n ```\n[google link](http://www.google.com)'
    };
  }

  updateContent(newContent) {
    this.setState({ content: newContent});
  }

	render() {
    const editorStyle = {
      padding: '10px 15px',
      background: 'white',
      border: '1px solid lightgray',
      borderRadius: 3
    };
    const editorContentStyle = {
      border: '1px solid lightgray',
      borderRadius: 3,
      padding: 3,
      boxShadow: '0 1px lightgray inset'

    };
		return (
			<section>
        <div style={editorStyle}>
          <div className="mdl-textfield mdl-js-textfield">
            <input className="mdl-textfield__input" type="text" id="articleTitle"/>
            <label className="mdl-textfield__label" htmlFor="articleTitle">Title</label>
          </div>
          <div style={{float: 'right'}}>
            <button className="mdl-button mdl-js-button mdl-button--icon">
              <i className="fa fa-tag" />
            </button>
            <button className="mdl-button mdl-js-button mdl-button--icon">
              <i className="fa fa-paperclip" />
            </button>
          </div>
          <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
            <div className="mdl-tabs__tab-bar">
                <a href="#write-panel" className="mdl-tabs__tab is-active">Write</a>
                <a href="#preview-panel" className="mdl-tabs__tab">Preview</a>
                 <div className="mdl-layout-spacer"></div>
            </div>

            <div className="mdl-tabs__panel is-active" id="write-panel">
              <div style={editorContentStyle}>
                <Codemirror
                  value={this.state.content}
                  onChange={::this.updateContent}
                  options={{mode: 'gfm'}}/>
              </div>
            </div>
            <div className="mdl-tabs__panel" id="preview-panel">
              <Markdown source={this.state.content} />
            </div>
          </div>

          <br />
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
            Submit
          </button>
        </div>
      </section>
		);
	}
}

export default ArticlePage;
