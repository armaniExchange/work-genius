// Styles
import './_Filter-List.css';
// Libraries
import React, { Component, PropTypes } from 'react';

class FilterList extends Component {
	constructor(props) {
		super(props);
		this._renderFilterByCategory = ::this._renderFilterByCategory;
		this._onFilterHandler = ::this._onFilterHandler;
	}

	_onFilterHandler() {
		const {
			onFilterHandler,
			categories
		} = this.props;
		let filterConditions = {};

		Object.keys(categories).forEach((name) => {
			filterConditions[name] = this.refs[`${name.toLowerCase()}Filter`].value;
		});

		onFilterHandler(filterConditions);
	}

	_renderFilterByCategory(category, keyName) {
		const { data, categories } = this.props;
		let lowerCaseCategory = category.toLowerCase();
		let options = [];
		let optionsHtml = data.map((cell, i) => {
			if (cell[category] !== '' && options.indexOf(cell[category]) < 0) {
				options.push(cell[category]);
				return (
					<option
					    key={i}
					    value={cell[category]}>
					    {cell[category]}
					</option>
				);
			}
			return null;
		});

		return (
			<span className="task-table-filters__filter" key={keyName}>
				<span>{category}: </span>
				<select ref={`${lowerCaseCategory}Filter`} onChange={this._onFilterHandler} value={categories[category]}>
					<option value={''}>All</option>
					{optionsHtml}
				</select>
			</span>
		);
	}

	render() {
		const { categories } = this.props;
		let filters = Object.keys(categories).map((category, i) => {
			return this._renderFilterByCategory(category, i);
		});
		return (
			<div className="filter-list">
				{filters}
			</div>
		);
	}
}

FilterList.propTypes = {
	data           : PropTypes.array.isRequired,
	categories     : PropTypes.object,
	onFilterHandler: PropTypes.func
};

FilterList.defaultProps = {
	categories     : [],
	onFilterHandler: () => {}
};

export default FilterList;
