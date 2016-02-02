/**
 * @author Howard Chang
 */
// Libraries
import React, { Component, PropTypes } from 'react';

class PrivilegeTable extends Component {
	render() {
		return (
			<div>Table</div>
		);
	}
}

PrivilegeTable.propTypes = {
	data: PropTypes.array.isRequired,
	titleKeyMap: PropTypes.array.isRequired
};

PrivilegeTable.defaultProps = {};

export default PrivilegeTable;
