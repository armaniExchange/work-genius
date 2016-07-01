import React, { Component, PropTypes } from 'react';
import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
import Td from '../A10-UI/Table/Td';
import moment from 'moment';

let TableHeader = () => {
	return (<thead>
	            <tr>
	            <Th>Release</Th>
	            <Th>Release Date</Th>
	            <Th>GUI Priority</Th>
	            <Th>Action</Th>
	            </tr>
            </thead>);
};

let TableBody = ({data}) => {
	let bodyHtml = (
		<tbody>
	        <tr>
	            <Td
	                colSpan=4>
	                No Match Result!
	            </Td>
	        </tr>
        </tbody>
    );
    if(data.length > 0) {
    	bodyHtml = data.map( release => {
    		return (
    			<tr>
    				<Td>
    					release.name
    				</Td>
    				<Td>
    					moment(release.date).format('YYYY-HH-DD')
    				</Td>
    				<Td>
    					release.priority
    				</Td>
    				<Td>
    				</Td>
    			</tr>
			);
    	});
    	bodyHtml = <tbody>{bodyHtml}</tbody>
    }
    return bodyHtml;
};

class ReleaseTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Table className="table">
                <TableHeader
                    {...this.props} />
                <TableBody {...this.props} />
            </Table>
        );
    }
}

ReleaseTable.propTypes = {
    data                 : PropTypes.array.isRequired,
};

export default ReleaseTable;