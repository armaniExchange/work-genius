import React, {Component, PropTypes} from 'react';

import Td from '../A10-UI/Table/Td';
// import Select from 'react-select';


class BugModuleBody extends Component {
    constructor(){
        super();
    }

    render () {
        const {
            data, titleKeyMap
        } = this.props;

        let bodyHtml = (
            <tr>
                <Td
                    colSpan={titleKeyMap.length}
                    className="bug-report-table__body--empty">
                    No Match Result!
                </Td>
            </tr>
        );
        if (data && data.length > 0) {
            bodyHtml = data.map((bug, bodyIndex) => {
                const cellHtml = titleKeyMap.map((header, cellIndex) => {
                    let isAlignLeft = false;
                    let className = 'bug-report-table__body--center';
                     return (
                        <Td key={cellIndex}
                        isAlignLeft={isAlignLeft}
                        className={className}
                        colSpan={header['colspan']}>{bug[header['key']]}</Td>
                    );
                });

                return (
                    <tr key={bodyIndex}>
                        {cellHtml}
                    </tr>
                );
            });
        }

        return (
            <tbody className="bug-report-table__body">
                {bodyHtml}
            </tbody>
        );
    }
}

BugModuleBody.propTypes = {
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired
};

export default BugModuleBody;
