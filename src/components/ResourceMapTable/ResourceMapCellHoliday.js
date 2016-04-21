import './ResourceMapTable.css';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class ResourceMapCellHoliday extends Component {

	render() {
		const { config } = this.props;
		let date;
		if (config.date instanceof moment) {
			date = config.date;
		} else {
			date = moment(config.date);
		}

		let day = date.isoWeekday();
		let name;
		if (day === 6 || day === 7) {
			name = '';
		} else {
			name = 'Holiday';
		}
		return (<div className="cell-top-item"><span >{name}</span></div>);
	}
}

ResourceMapCellHoliday.propTypes = {
	config: PropTypes.object.isRequired
};

export default ResourceMapCellHoliday;