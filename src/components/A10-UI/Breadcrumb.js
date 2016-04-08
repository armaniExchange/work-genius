import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FIRST_BREADCRUMB } from '../../constants/breadcrumb';

export default class Breadcrumb extends Component {
  render() {
    let { data } = this.props;
    data  = FIRST_BREADCRUMB.concat(data);
    return (<ol className="breadcrumb a10-breadcrumb">{
      data.map((item,idx) => {
        let isLast = idx===data.length-1;
        let child = isLast ? [item.txt] : [<Link to={item.url}>{item.txt}</Link>];
        if (!isLast) {
          child.push(<span className="a10-breadcrumb__divide" dangerouslySetInnerHTML={{__html:'&raquo;'}}></span>);
        }
        return <li>{child}</li>;
      })
    }</ol>);
  }
};

Breadcrumb.propTypes = {
  data: PropTypes.array
};
Breadcrumb.defaultProps = {
  data: []
};
