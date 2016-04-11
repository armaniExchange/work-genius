import './ResourceMapTable.css';

import React, { Component, PropTypes } from 'react';

import Th from '../A10-UI/Table/Th';
import moment from 'moment';

const dateFormate = function(date, fmt)
  { //author: meizz
    var o = {
      'M+' : date.getMonth()+1,                 //月份
      'd+' : date.getDate(),                    //日
      'h+' : date.getHours(),                   //小时
      'm+' : date.getMinutes(),                 //分
      's+' : date.getSeconds(),                 //秒
      'q+' : Math.floor((date.getMonth()+3)/3), //季度
      'S'  : date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('('+ k +')').test(fmt)) {
	    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (('00'+ o[k]).substr(('' + o[k]).length)));
	  }
	}
    return fmt;
  };

const getDateList = function (startDate, totalDays, format){
  var start = new Date(startDate);
  var results = [];
  start.setDate(start.getDate() - 1);
  for (var i = 0; i < totalDays; i ++) {
    let pre = {};
    start.setDate(start.getDate() + 1);
    pre.date = dateFormate(start, format);
    pre.day = start.getDay();
    results.push(pre);
  }
  return results;
};

class ResourceMapTableHeader extends Component {


	render() {
		const {
			startDate,
			totalDays
		} = this.props;

		var dateList = getDateList(startDate, totalDays, 'yyyy-MM-dd');

		var headerHtml = dateList.map((headerObj, index) => {
      let className = 'table_header_style ';
      //let date = headerObj.date;
      let mo = moment(headerObj.date);
      let day = mo.isoWeekday();
      if (day === 6 || day === 7) {
        className += 'weekend-style';
      }
			return (
				<Th
					className={className}
					key={index}
					colSpan={1}
				>
					{mo.format('M/D')}
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
	totalDays: 10
};

export default ResourceMapTableHeader;