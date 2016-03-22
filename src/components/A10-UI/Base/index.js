// Libraries
import React, { PropTypes, Component } from 'react';

export const HideShow = (AnyComponent) => {
  class HideShowComponent extends Component {
    render() {
      const {children, show, force} = this.props;

      let showStyle = {display:''};
      switch (typeof force) {
        case 'boolean':
          if (force) { showStyle = {display:'block'}; }
        break;
        case 'string':
          if (force) { showStyle = {display:force}; } //`force` might be table-cell if you want.
        break;
      }
      const HIDE_SHOW_SYTLE = show ? showStyle : {display:'none'};
      const STYLE = Object.assign({}, HIDE_SHOW_SYTLE);
      return (<div style={STYLE}>
        <AnyComponent {...this.props}>
          {children}
        </AnyComponent>
      </div>);
    }
  };
  
  HideShowComponent.propTypes = {
    children: PropTypes.element,
    show: PropTypes.bool,
    force: PropTypes.oneOfType([ //<--Need we force to make it as boolean only?
      PropTypes.string,
      PropTypes.bool])
  };

  return HideShowComponent;
};
