// Style
import './_NotFoundPage';
// React & Redux
import React, { Component } from 'react';

class NotFoundPage extends Component {
	render() {
		return (
			<div className="Not-Found-Page">
				<h1 className="Not-Found-Page__header">404</h1>
				<div className="Not-Found-Page__content">The page you are looking for is not here :(</div>
			</div>
		);
	}
}

export default NotFoundPage;
