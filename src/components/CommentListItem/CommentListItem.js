// Libraries
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import moment from 'moment';

import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
import Avatar from '../../components/Avatar/Avatar';

// Styles
import './_CommentListItem.css';

class CommentListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
    const { id, onEditClick } = this.props;
    onEditClick(id);
  }

  onDeleteClick() {
    const { id, onDeleteClick } = this.props;
    onDeleteClick(id);
  }

  render() {
    const {
      author,
      content,
      currentUserId,
      createdAt
    } = this.props;
    const isAuthorCurrentUser = author && (author.id === currentUserId);
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
            this.state.isHovered && (
              <div className="toolbar">
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

    return (
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
  currentUserId : PropTypes.string,
  onEditClick   : PropTypes.func,
  onDeleteClick : PropTypes.func,
};


CommentListItem.defaultProps = {
  content         : '',
  currentUserId   : ''
};

export default CommentListItem;
