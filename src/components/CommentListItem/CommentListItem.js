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

  render() {
    const {
      author,
      content,
      currentUserId
    } = this.props;
    const isAuthorCurrentUser = author && (author.id === currentUserId);
    // const triangleClassName = `avatar-triangle ${isAuthorCurrentUser ? 'left' : 'right'}`;

    const renderAuthor = (
      <div
        key="renderAuthor"
        className={`author ${isAuthorCurrentUser ? 'right' : 'left'}`}>
        <Avatar user={author} />
        <div className="avatar-triangle" />
      </div>
    );

    const renderContent = (
      <Paper
        key="renderContent"
        className="content">
        <HighlightMarkdown source={content} />
        {
          this.state.isHovered && (
            <div style={{
              position: 'absolute',
              top: 5,
              right: 5
            }}>
              <FlatButton
                label="Edit"
                primary={true} />
              <FlatButton
                label="Delete" />
            </div>
          )
        }
      </Paper>
    );

    return (
      <div className="component-comment-list-item"
        onMouseEnter={::this.onMouseEnter}
        onMouseLeave={::this.onMouseLeave}>
        <div className="component-comment-list-item-wrapper">
          { isAuthorCurrentUser ? [renderContent, renderAuthor] : [renderAuthor, renderContent]}
        </div>
        <div style={{textAlign: 'right', color: 'gray'}}>
          {moment().format('YYYY-MM-DD hh:mm a')}
        </div>
      </div>
    );
  }
}

CommentListItem.propTypes = {
  content         : PropTypes.string,
  author          : PropTypes.object,
  currentUserId   : PropTypes.string
};


CommentListItem.defaultProps = {
  content         : '',
  currentUserId   : ''
};

export default CommentListItem;
