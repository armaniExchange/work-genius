// Libraries
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

import Editor from '../../components/Editor/Editor';
import Avatar from '../../components/Avatar/Avatar';

// Styles
import './_CommentEditor.css';
import '../CommentListItem/_CommentListItem.css';

class CommentEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingContent: props.content
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editingContent: nextProps.content
    }) ;
  }

  onContentChange(newContent) {
    this.setState({ editingContent: newContent});
  }

  onSubmit() {
    this.props.onSubmit(this.state.editingContent);
  }

  render() {
    const {
      editingContent,
    } = this.state;
    const {
      currentUser,
      onCancel
    } = this.props;
    const buttonStyle = {
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 10,
      float: 'right'
    };
    return (
      <div
        className="component-comment-list-item editor">
        <div className="component-comment-list-item-wrapper">
          <div className="content">
            <Paper className="message">
              <Editor
                placeholder="Write a comment..."
                value={editingContent}
                onChange={::this.onContentChange} />
            </Paper>
            <RaisedButton
              disabled={!editingContent}
              style={buttonStyle}
              label="Comment"
              primary={true}
              onClick={::this.onSubmit} />
            {
              typeof onCancel === 'function' ? (
                <RaisedButton
                  style={buttonStyle}
                  label="Cancel"
                  onClick={onCancel} />
              ) : null
            }
          </div>
          <div className="author right">
            <Avatar user={currentUser} />
            <div className="avatar-triangle" />
          </div>
        </div>
      </div>
    );
  }
}

CommentEditor.propTypes = {
  content         : PropTypes.string,
  currentUser     : PropTypes.object,
  onSubmit        : PropTypes.func,
  onCancel        : PropTypes.func
};

CommentEditor.defaultProps = {
  content         : ''
};

export default CommentEditor;
