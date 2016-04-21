// Libraries
import React, { Component, PropTypes } from 'react';
import MaterialAvatar from 'material-ui/lib/avatar' ;
import colors from 'material-ui/lib/styles/colors';

// Styles
import './_Avatar.css';

class Avatar extends Component {

  getShortName(name) {
    return name.split(' ')
      .filter((item, index)=> {
        return index <= 1;
      })
      .map(subStr => subStr[0].toUpperCase())
      .reduce((prev, value)=> prev + value, '');
  }

  render() {
    const { user } = this.props;
    return (
      <MaterialAvatar
        {...this.props}
        color={colors.fullWhite}
        backgroundColor={colors.blue900} >
        {::this.getShortName(user.name)}
      </MaterialAvatar>
    );
  }
}

Avatar.propTypes = {
  user              : PropTypes.object.isRequired
};

Avatar.defaultProps = {
  id                  : '',
};

export default Avatar;
