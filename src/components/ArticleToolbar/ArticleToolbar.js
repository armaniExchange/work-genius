// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Divider from 'material-ui/lib/divider';
import { SERVER_EXPORT_URL } from '../../constants/config';

// Styles
import './_ArticleToolbar.css';
class ArticleToolbar extends Component {

  onDelete() {
    const {
      id,
      onDelete
    } = this.props;
    onDelete(id);
  }

  render() {
    const { id } = this.props;
    const buttonTextStyle = {
      top: 4,
      position: 'relative',
      right: -10,
      fontWeight: 900
    };
    const wrapperStyle = {
      position: 'absolute',
      top: 10,
      right: 10
    };
    return (
      <div style={wrapperStyle}>
        <IconMenu
          iconButtonElement={
            <div><span style={buttonTextStyle}>Actions</span><IconButton><MoreVertIcon /></IconButton></div>
          }
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <Link to={`/main/knowledge/document/edit/${id}`}>
            <MenuItem primaryText="Edit" leftIcon={<i className="fa fa-edit" style={{fontSize: 24}}/>} />
          </Link>
          <MenuItem primaryText="Delete" leftIcon={<i className="fa fa-trash" style={{fontSize: 24}}/>} onClick={::this.onDelete}/>
          <Divider />
          <a href={`${SERVER_EXPORT_URL}/document/${id}?token=${localStorage.token}`} download>
            <MenuItem primaryText="Article PDF" leftIcon={<i className="fa fa-download" style={{fontSize: 24}}/>}/>
          </a>
          <a href={`${SERVER_EXPORT_URL}/document/${id}?withComments=true&token=${localStorage.token}`} download>
            <MenuItem primaryText="Article with Comments PDF" leftIcon={<i className="fa fa-download" style={{fontSize: 24}}/>}/>
          </a>
        </IconMenu>
      </div>
    );
  }
}


ArticleToolbar.propTypes = {
  id              : PropTypes.string,
  onDelete        : PropTypes.func
};


ArticleToolbar.defaultProps = {
  id              : '',
  index           : null
};

export default ArticleToolbar;
