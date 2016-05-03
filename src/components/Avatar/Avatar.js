// Libraries
import React, { Component, PropTypes } from 'react';
import MaterialAvatar from 'material-ui/lib/avatar' ;
import colors from 'material-ui/lib/styles/colors';

// Styles
import './_Avatar.css';

class Avatar extends Component {

  getShortName(name) {
    return name.split(' ')
      .filter((item, index)=> index <= 1 )
      .map(subStr => subStr[0].toUpperCase())
      .reduce((prev, value)=> prev + value, '');
  }

  render() {
    const { user } = this.props;
    const { fullWhite, blue900 } = colors;
    return (
      <MaterialAvatar
        {...this.props}
        title={`${user.name}, ${user.email}`}
        color={fullWhite}
        backgroundColor={blue900} >
        {::this.getShortName(user.name)}
      </MaterialAvatar>
    );
  }
}

Avatar.propTypes = {
  user              : PropTypes.object.isRequired
};

Avatar.defaultProps = {
  id                : '',
};

export default Avatar;
