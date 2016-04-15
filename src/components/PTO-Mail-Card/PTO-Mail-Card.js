// Styles
import './PTO-Mail-Card.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import {
	PENDING,
	APPROVED,
	DENIED,
	CANCEL_REQUEST_PENDING,
	CANCEL_REQUEST_APPROVED
} from '../../constants/pto-constants';

class PTOMailCard extends Component {
	_generateContent() {
		const {
			type,
			applicant,
			manager,
			startDate,
			endDate,
			hours,
			status,
			link
		} = this.props;
		let resultHtml;

		if (type === `PTO_${PENDING}`) {
			resultHtml = (
				<div>
				    <div>Hi Managers, </div>
					<br/>
					<div>
				        <b>{applicant}</b> has applied for <b>{hours}</b> hours of PTO from <b>{startDate}</b> to <b>{endDate}</b>.
					</div>
					Please go to <a href={link}> Knowledge Base </a> to keep this process going.
				</div>
			);
		} else if (type === `OVERTIME_${PENDING}`) {
			resultHtml = (
				<div>
				    <div>Hi Managers, </div>
					<br/>
					<div>
				        <b>{applicant}</b> has applied for <b>{hours}</b> hours of Overtime on <b>{startDate}</b>.
					</div>
					Please go to <a href={link}> Knowledge Base </a> to keep this process going.
				</div>
			);
		} else if (type === `OVERTIME_${APPROVED}` || type === `OVERTIME_${DENIED}`) {
			resultHtml = (
				<div>
				    <div>Hi, {applicant}</div>
					<br/>
					<div>
				        <b>{manager}</b> has {status} your <b>{hours}</b> hours of Overtime applicantion on <b>{startDate}</b>.
					</div>
				</div>
			);
		} else if (type === `PTO_${APPROVED}` || type === `PTO_${DENIED}` || type === `PTO_${CANCEL_REQUEST_APPROVED}`) {
			resultHtml = (
				<div>
				    <div>Hi, {applicant}</div>
					<br/>
					<div>
				        <b>{manager}</b> has {status} your <b>{hours}</b> hours of PTO applicantion from <b>{startDate}</b> to <b>{endDate}</b>.
					</div>
				</div>
			);
			if (type === `PTO_${CANCEL_REQUEST_APPROVED}`) {
				resultHtml = (
					<div>
						<div>Hi, {applicant}</div>
						<br/>
						<div>
					        <b>{manager}</b> has APPROVED your CANCEL REQUEST on <b>{hours}</b> hours PTO applicantion from <b>{startDate}</b> to <b>{endDate}</b>.
						</div>
					</div>
				);
            }
		} else if (type === `PTO_${CANCEL_REQUEST_PENDING}`) {
			resultHtml = (
				<div>
					<div>Hi Managers, </div>
					<br/>
					<div>
				        <b>{applicant}</b> has CANCELED the <b>{hours}</b> hours of PTO application from <b>{startDate}</b> to <b>{endDate}</b>.
					</div>
					Please go to <a href={link}> Knowledge Base </a> to keep this process going.
				</div>
			);
		}

		return resultHtml;
	}
	render() {
		let content = ::this._generateContent();
		return (
			<div className="PTO-mail-card">
				{content}
				<br/>
				<br/>
				KB,
				<br/>
				Thanks
			</div>
		);
	}
};

PTOMailCard.propTypes = {
	type     : PropTypes.string,
	link     : PropTypes.string,
	startDate: PropTypes.string,
	endDate  : PropTypes.string,
	hours    : PropTypes.string,
	status   : PropTypes.string,
	manager  : PropTypes.string,
	applicant: PropTypes.string,
};

PTOMailCard.defaultProps = {
	type     : '',
	link     : '',
	startDate: '',
	endDate  : '',
	hours    : '',
	status   : '',
	manager  : '',
	applicant: '',
};

export default PTOMailCard;
