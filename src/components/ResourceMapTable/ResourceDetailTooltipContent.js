
import './ResourceMapTable.css';

import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';

import moment from 'moment';
// import AutosizeInput from 'react-input-autosize';

class ResourceDetailTooltipContent extends Component {

  static propTypes = {
    item: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      width: '300px',
      labelClass: 'mdl-cell mdl-cell--6-col',
      contentClass: 'mdl-cell mdl-cell--6-col'
    };
  }

  componentDidMount() {
    this.reset();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Modify the props or modify the state width, to update this component.
    return nextProps !== this.props || nextState.width !== this.state.width;
  }

  componentDidUpdate() {
    this.reset();
  }

  reset() {
    const componentDom = ReactDom.findDOMNode(this);
    const height = componentDom.offsetHeight;
    if (height <= 500) {
      this.setState({
        width: '300px',
        labelClass: 'mdl-cell mdl-cell--6-col',
        contentClass: 'mdl-cell mdl-cell--6-col'
      });
    } else {
      this.setState({
        width: '600px',
        labelClass: 'mdl-cell mdl-cell--3-col',
        contentClass: 'mdl-cell mdl-cell--9-col'
      });
    }
  }

  render() {
    const { item } = this.props;
    return (
      <div className="mdl-grid" style={{ width: this.state.width}}>
        <div className={this.state.labelClass}><label>Today Percentage</label></div>
        <div className={this.state.contentClass}><span>{item.daily_percentage}%</span></div>

        <div className={this.state.labelClass}><label>Task</label></div>
        <div className={this.state.contentClass}><span>{item.title}</span></div>

        <div className={this.state.labelClass}><label>Start Date</label></div>
        <div className={this.state.contentClass}>
          <span><em>{moment(item.start_date).format('YYYY-MM-DD HH:MM')}</em></span>
        </div>

        <div className={this.state.labelClass}><label>End Date</label></div>
        <div className={this.state.contentClass}>
          <span><em>{moment(item.end_date).format('YYYY-MM-DD HH:MM')}</em></span>
        </div>

        <div className={this.state.labelClass}><label>Duration</label></div>
        <div className={this.state.contentClass}>
          <span><em>{item.duration ? item.duration : 0}</em> Hours</span>
        </div>

        <div className={this.state.labelClass}><label>Work Log</label></div>
        <div className={this.state.contentClass}>
          <pre className="none-pre">{item.content}</pre>
        </div>

        <div className={this.state.labelClass}><label>Progress</label></div>
        <div className={this.state.contentClass}><em>{item.progress}%</em></div>
      </div>
    );
  }
}

export default ResourceDetailTooltipContent;
