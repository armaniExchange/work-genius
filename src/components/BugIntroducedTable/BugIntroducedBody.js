import React, {Component, PropTypes} from 'react';

import Td from '../A10-UI/Table/Td';
// import Select from 'react-select';


class BugIntroducedBody extends Component {
    constructor(){
        super();
        this.state = {details: {}, name: '111'};
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
        if (data.length > 0) {
            bodyHtml = data.map((review, bodyIndex) => {
                var bugId = review['id'];
                let causeDetail = review['review'];
                this.state.details[bugId] = causeDetail;
                const cellHtml = titleKeyMap.map((header, cellIndex) => {
                    let isAlignLeft = header['key'] === 'title';
                    let className = isAlignLeft ? '' : 'bug-report-table__body--center';

                    if (header['key'] === 'id') {
                        className += ' table-bug-id-width';
                        return (
                            <Td key={cellIndex}
                            isAlignLeft={isAlignLeft}
                            className={className}
                            colSpan={header['colspan']}>{review[header['key']]}</Td>
                        );
                    }
                     return (
                        <Td key={cellIndex}
                        isAlignLeft={isAlignLeft}
                        className={className}
                        colSpan={header['colspan']}>{review[header['key']]}</Td>
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

BugIntroducedBody.propTypes = {
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func
};

export default BugIntroducedBody;
