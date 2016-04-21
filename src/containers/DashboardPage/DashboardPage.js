// Style
import './_DashboardPage.css';
import bjImg from '../../assets/images/bj-group.jpg';
import tpImg from '../../assets/images/tp-group.jpg';
import sjImg from '../../assets/images/sj-group.jpg';

// React & Redux
import React, { Component } from 'react';

class DashboardPage extends Component {
	render() {
		return (
			<div>
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
