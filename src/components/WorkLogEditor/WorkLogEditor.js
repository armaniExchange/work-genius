// Libraries
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/lib/text-field';
import Select from 'react-select';

import RaisedButton from 'material-ui/lib/raised-button';
import Editor from '../../components/Editor/Editor';

// Styles
import './_WorkLogEditor.css';

class WorkLogEditor extends Component {

  constructor(props) {
    super(props);
    this._onSelectTag = ::this._onSelectTag;
    this._onChangEditor = ::this._onChangEditor;
    this._changeTitle = ::this._changeTitle;
    this._onSubmit = ::this._onSubmit;
    this._onCancel = ::this._onCancel;
    this.state = {
      tags: '',
      title: '',
      content: ''
    };
  }

  componentWillMount() {
    const { tagActions } = this.props;
    tagActions('get');
  }

  componentWillReceiveProps(nextState) {
    this.setState({
      tags: nextState.tag,
      title: nextState.title,
      content: nextState.content
    });
  }

  _onSelectTag(type) {
    this.setState({tags: type});
    let types = type.split(',');
    const { tags, tagActions } = this.props;
    for (let newType of types) {
      let tag = tags.find((inTag) => {
        return inTag.tag_name === newType;
      });
      if (newType !== undefined && tag === undefined) {
        tagActions('add', newType);
      }
    }
  }

  _onChangEditor(text) {
    this.setState({content: text});
  }

  _changeTitle() {
    const { titleRef } = this.refs;
    let titleValue = titleRef.getValue();
    this.setState({title: titleValue});
  }

  _onSubmit() {
    let tags = this.state.tags;
    tags = tags ? tags.split(',') : [];
    const { createWorkLog } = this.props;
    let data = {
      title: this.state.title,
      content: this.state.content,
      tags: tags
    };
    createWorkLog(data);
  }

  _onCancel() {
    const { titleRef } = this.refs;
    let titleField = ReactDOM.findDOMNode(titleRef);
    console.log(titleField);
    titleField.value = 'ccccccccccccccc';
    titleRef.value = 'sccccc';
    this.setState({
      tags: '',
      title: '',
      content: ''
    });
  }

  render() {
    const {
      tags
    } = this.props;
    let myTag = tags;
    myTag = myTag ? myTag : [];
    return (
      <div className="worklog-editor" {...this.props} >
        <TextField
          type="text"
          style={{width: '100%'}}
          hintText="Title"
          ref="titleRef"
          value={this.state.value}
          onChange={this._changeTitle}
        />

        <br />
        <label>Content</label>
        <Editor
          value={this.state.content}
          onChange={this._onChangEditor}
        />
        <br />
        <label>Tags</label>
        <Select
              multi={true}
              allowCreate={true}
              name="menu_tag"
              value={this.state.tags}
              options={myTag.map((tag) => {
                return {label: tag.tag_name, value: tag.tag_name};
              })}
              onChange={this._onSelectTag}
            />
        <div>
          <br />
          <RaisedButton
            label="Apply"
            secondary={true}
            disabled={!this.state.title || !this.state.content}
            onClick={this._onSubmit}
          />
          <RaisedButton label="Cancel" onClick={this._onCancel} />
        </div>
      </div>
    );
  }
}

WorkLogEditor.propTypes = {
  id                  : PropTypes.string,
  title               : PropTypes.string,
  content             : PropTypes.string,
  tags                : PropTypes.array.isRequired,
  style               : PropTypes.object,
  tagSuggestions      : PropTypes.arrayOf(PropTypes.string),
  tagActions          : PropTypes.func.isRequired,
  createWorkLog       : PropTypes.func.isRequired,
  updateWorkLog       : PropTypes.func.isRequired,
  onContentChange     : PropTypes.func.isRequired,
  onTitleChange       : PropTypes.func.isRequired,
  onTagsChange        : PropTypes.func.isRequired
};

WorkLogEditor.defaultProps = {
  title               : '',
  content             : '',
  tagSuggestions      : [],
  onContentChange     : () => {},
  onTitleChange       : () => {},
  onTagsChange        : () => {}
};

export default WorkLogEditor;
