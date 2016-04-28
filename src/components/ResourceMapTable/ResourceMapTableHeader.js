import './ResourceMapTable.css';

import React, { Component, PropTypes } from 'react';

import Th from '../A10-UI/Table/Th';
import moment from 'moment';

const getDateList = function (startDate, totalDays) {
  var start = moment(startDate);
  var results = [];
  for (var i = 0; i < totalDays; i ++) {
    let pre = {};
    pre.date = start.format('YYYY-MM-DD');
    pre.format = start.format('M/D');
    pre.day = start.isoWeekday();
    results.push(pre);
    start.add(1, 'days');
  }
  return results;
};

class ResourceMapTableHeader extends Component {


	render() {
		const {
			startDate,
			totalDays
		} = this.props;

    var dateList = getDateList(startDate, totalDays);
		var headerHtml = dateList.map((headerObj, index) => {
      let className = 'table_header_style ';
      let day = headerObj.day;
      if (day === 6 || day === 7) {
        className += 'weekend-style';
      }
			return (
				<Th
					className={className}
					key={index}
					colSpan={1}
				>
					{headerObj.format}
				</Th>
			);
		});
		return (
			<thead>
	            <tr>
	            	<Th className={'table_header_style'}/>
	            	{headerHtml}
	            </tr>
            </thead>
        );
	};
}

ResourceMapTableHeader.propTypes = {
    startDate          : PropTypes.string.isRequired,
    totalDays          : PropTypes.number.isRequired
};

ResourceMapTableHeader.defaultProps = {
	startDate: new Date(),
	totalDays: 7
};

export default ResourceMapTableHeader;