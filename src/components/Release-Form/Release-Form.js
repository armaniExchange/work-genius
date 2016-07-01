import React, { Component, PropTypes } from 'react';

class ReleaseForm extents Component{
	constructor(props) {
        super(props);
    }

    render() {
    	return (
    		<form className="form-inline">
                <div className="form-group">
                    <label htmlFor="releaseName">Release</label>
                    <input type="text" className="form-control" ref="releaseName" placeholder=""/>
                </div>
                <div className="form-group">
                    <label htmlFor="releaseDate">Release Date</label>
                    <input
                        className="hidden"
                        ref="releaseDate" />
                    <div className="inline-div"> 
                        <DatePicker
                            className="option-layout"
                            placeholder=""
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">GUI Priority</label>
                    <select ref="priority" className="form-control">
                        <option value="High">High</option>
                        <option value="Middle">Middle</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <RaisedButton label={ 'Save' } secondary={true}/>
            </form>
		);
    }
}
export default ReleaseForm;