// Libraries
import React, { Component, PropTypes } from 'react';
// Styles
import './Name-Filter-Group.css';
// Components
import NameFilter from '../../components/Name-Filter/Name-Filter.js';

class NameFilterGroup extends Component {
	render() {
		const { users, currentSelectedUserID, onUserClickedHandler } = this.props;
		let nameFilterHTML = users.map((user, index) => (
	        <NameFilter
	            key={index}
	            nameID={user.id}
	            name={user.name}
	            subtitle={user.subtitle}
	            selected={currentSelectedUserID === user.id}
	            onClickHandler={onUserClickedHandler}/>
	    ));
	    return (
	        <div className="name-filter-group">
	        	<NameFilter
		            nameID={''}
		            name={'All'}
		            selected={currentSelectedUserID === ''}
		            onClickHandler={onUserClickedHandler}/>
	            { nameFilterHTML }
	        </div>
	    );
	}
}

NameFilterGroup.propTypes = {
	users                : PropTypes.array.isRequired,
	currentSelectedUserID: PropTypes.string.isRequired,
	onUserClickedHandler : PropTypes.func
};

NameFilterGroup.defaultProps = {
	onUserClickedHandler: () => {}
};

export default NameFilterGroup;
