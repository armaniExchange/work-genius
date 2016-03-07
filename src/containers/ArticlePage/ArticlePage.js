// Style
import './_ArticlePage.scss';
// React & Redux
import React, { Component } from 'react';
import Markdown from 'react-markdown';
import Codemirror from 'react-codemirror';
import ReactTags from 'react-tag-input';
const Tags = ReactTags.WithContext;

import 'codemirror/mode/gfm/gfm';
import 'codemirror/lib/codemirror.css';
import 'react-tag-input/example/reactTags.css';

class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '# this is a test \n * 1 \n * 2 \n ```js \nfunction(){\n  console.log("test"); \n}\n ```\n[google link](http://www.google.com)\n<iframe width="560" height="315" src="https://www.youtube.com/embed/Mqr-kjvXsk8" frameborder="0" allowfullscreen></iframe>',
      tags: [],
      tagSuggestions: ['Banana', 'Mango', 'Pear', 'Apricot']
    };
  }

  handleTagDelete(i) {
    let tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags});
  }

  updateContent(newContent) {
    this.setState({ content: newContent});
  }

  handleTagAddition(tag) {
    let tags = this.state.tags;
    tags.push({
      id: tags.length + 1,
      text: tag
    });
    this.setState({tags});
  }
  handleTagDrag(tag, currPos, newPos) {
    let tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags });
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
    const {
      tags,
      tagSuggestions
    } = this.state;

    return (
      <section>
        <div style={editorStyle}>
          <div className="mdl-textfield mdl-js-textfield">
            <input className="mdl-textfield__input" type="text" id="articleTitle"/>
            <label className="mdl-textfield__label" htmlFor="articleTitle">Title</label>
          </div>
          <div style={{float: 'right'}}>
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
          <div style={{paddingLeft: 30, position: 'relative', margin: '15px 0'}}>
            <i className="fa fa-tag fa-2x" style={{position: 'absolute', left: 0}}/>
            <Tags
              tags={tags}
              suggestions={tagSuggestions}
              handleDelete={::this.handleTagDelete}
              handleAddition={::this.handleTagAddition}
              handleDrag={::this.handleTagDrag}/>
          </div>
          <br />
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
