import './ResourceMapTable.css';

import React, { Component, PropTypes } from 'react';

import Th from '../A10-UI/Table/Th';
import Table from '../A10-UI/Table/Table';
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
		let styles = totalDays === 30 ? { width: '4650px' } : {};
		var headerHtml = dateList.map((headerObj, index) => {
      let className = 'table_header_style ';
      let day = headerObj.day;
      if (day === 6 || day === 7) {
        className += 'weekend-style';
			}
			if (totalDays === 7) {
				return (
					<Th
						className={className}
						key={index}
						colSpan={1}
					>
						{headerObj.format}
					</Th>
				);
			} else {
				return (
					<Th
						className={className}
						key={index}
						style={{ width: '150px', position: 'relative' }}
					>
						{headerObj.format}
					</Th>
				);
			}
		});

		if ( totalDays === 7) {
			return (
				<thead>
					<tr style={styles}>
						<Th className={'table_header_style'} style={{ width: '150px' }}/>
						{headerHtml}
					</tr>
				</thead>
			);
		}
		return (
			<Table className="bug-review-table">
					<thead>
					<tr style={styles}>
						<Th className={'table_header_style'} style={{ width: '150px' }}/>
						{headerHtml}
					</tr>
				</thead>
			</Table>
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
