// Libraries
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import moment from 'moment';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import CommentEditor from '../../components/CommentEditor/CommentEditor';
import Avatar from '../../components/Avatar/Avatar';

// Styles
import './_CommentListItem.css';

class CommentListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      isHovered: false
    };
  }

  onMouseEnter() {
    this.setState({isHovered: true});
  }

  onMouseLeave() {
    this.setState({isHovered: false});
  }

  onEditClick() {
    this.setState({isEditing: true});
  }

  onDeleteClick() {
    const { id, onDeleteClick } = this.props;
    onDeleteClick(id);
  }

  onSubmit(editingContent) {
    this.setState({isEditing: false});
    this.props.onSubmit({
      id: this.props.id,
      content: editingContent
    });
  }

  render() {
    const {
      author,
      content,
      currentUser,
      createdAt
    } = this.props;
    const { isEditing, isHovered } = this.state;
    const isAuthorCurrentUser = author && (author.id === currentUser.id);
    const renderAuthor = (
      <div
        key="renderAuthor"
        className={`author ${isAuthorCurrentUser ? 'right' : 'left'}`}>
        <Avatar user={author} />
        <div className="avatar-triangle" />
      </div>
    );

    //TODO: add edit
    const renderContent = (
      <div key="renderContent"
        className="content">
        <Paper className="message">
          <HighlightMarkdown source={content} />
          {
            isAuthorCurrentUser && isHovered && (
              <div className="toolbar">
                <FlatButton
                  label="Edit"
                  secondary={true}
                  onClick={::this.onEditClick} />
                <FlatButton
                  label="Delete"
                  onClick={::this.onDeleteClick} />
              </div>
            )
          }
        </Paper>
        <div className="time">
          {moment(createdAt).format('YYYY-MM-DD hh:mm a')}
        </div>
      </div>
    );

    return isAuthorCurrentUser && isEditing ? (
      <CommentEditor
        currentUser={currentUser}
        content={content}
        onSubmit={::this.onSubmit}
      />
    ): (
      <div className="component-comment-list-item"
        onMouseEnter={::this.onMouseEnter}
        onMouseLeave={::this.onMouseLeave}>
        <div className="component-comment-list-item-wrapper">
          { isAuthorCurrentUser ? [renderContent, renderAuthor] : [renderAuthor, renderContent]}
        </div>
      </div>
    );
  }
}

CommentListItem.propTypes = {
  id            : PropTypes.string,
  content       : PropTypes.string,
  author        : PropTypes.object,
  createdAt     : PropTypes.number,
  currentUser   : PropTypes.object,
  onDeleteClick : PropTypes.func,
  onSubmit      : PropTypes.func
};


CommentListItem.defaultProps = {
  content         : '',
  currentUser     : {id: ''}
};

export default CommentListItem;
