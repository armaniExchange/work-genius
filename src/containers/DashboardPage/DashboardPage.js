// Style
import './_DashboardPage.css';
import bjImg from '../../assets/images/bj-group.jpg';
import tpImg from '../../assets/images/tp-group.jpg';
import sjImg from '../../assets/images/sj-group.jpg';
import DatePicker from '../../components/A10-UI/Input/Date-Picker.js';
import RaisedButton from 'material-ui/lib/raised-button';

// React & Redux
import React, { Component } from 'react';

class DashboardPage extends Component {
	render() {
		return (
			<div>
                <div className="left-bar">
                    <div className="release">
                        <div className="release-header">
                            <h5>Release Priority</h5>
                        </div>
                        <div className="release-content">
                            <form className="form-inline">
                                <div className="form-group">
                                    <label htmlFor="releaseName">Release</label>
                                    <input type="text" className="form-control" id="releaseName" placeholder=""/>
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
                            <table className="table">
                            <thead>
                            <tr>
                            <th>Release</th>
                            <th>Release Date</th>
                            <th>GUI Priority</th>
                            <th>Action</th>
                            </tr>
                            </thead>
                            </table>
                        </div>
                    
                    </div> 
                    <div className="idea">
                        <h1>More Detailed, More Beautiful</h1>
                        <h2>细致些，美一些</h2>
                        <h3>細緻些，美一些</h3>
                        <h5>Create Better Use Experience GUI Is Our Mission</h5>
                        <hr/>
                        <ol>
                        <li>Less Bugs, No Reopen Bugs </li>
                        <li>Know Your Features Well,  Can Design More Useful Flow</li>
                        <li>Learn More Useful Technology</li>
                        </ol>
                    </div>
                </div>
				<div className="team">
			    	<h5>San Jose Team</h5>
    				<p><img src={sjImg}/></p>

			    	<h5>Beijing Team</h5>
    				<p><img src={bjImg}/></p>

    				<h5>Taipei Team</h5>
    				<p><img src={tpImg} /></p>
    			</div>
    		</div>
		);
	}
}

export default DashboardPage;
