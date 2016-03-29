// Styles
import './BugReviewTable.css';
import 'react-select/dist/react-select.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
// Constants
import Table from '../A10-UI/Table/Table';
import Th from '../A10-UI/Table/Th';
import Td from '../A10-UI/Table/Td';
import RadioGroup from '../A10-UI/Input/Radio-Group';
import Select from 'react-select';

let TableHeaders = ({ titleKeyMap, onSortHandler, sortBy, enableSort}) => {
    let headerHtml = titleKeyMap.map((headerObj, index) => {
        let header = headerObj.title;
        let colSpan = headerObj.colspan;
        const ascendingButtonClassNames = classnames('glyphicon glyphicon-menu-up', {
            'hide': sortBy.category !== header || sortBy.status !== 1
        });
        const descendingButtonClassNames = classnames('glyphicon glyphicon-menu-down', {
            'hide': sortBy.category !== header || sortBy.status !== -1
        });
        let filterIconHtml = (<span></span>);
        if (enableSort) {
            filterIconHtml = (
                <span data-name={header}>
                    <i
                        className={ascendingButtonClassNames}
                        data-name={header}>
                    </i>
                    <i
                        className={descendingButtonClassNames}
                        data-name={header}>
                    </i>
                </span>
            );
        }

        return (
            <Th
                key={index}
                className="pto-table__header"
                data-name={header}
                onClick={onSortHandler}
                colSpan={colSpan}
                >
                <span data-name={header}>{header}</span>
                {filterIconHtml}
            </Th>
        );
    });
    return (
        <thead>
            <tr>
                {headerHtml}
            </tr>
        </thead>
    );
};

let TableBody = ({ data, titleKeyMap, resolvedReasonTypes, optionsReviewTags, optionsMenus, changeReviewText, resolvedReasonTypeChange, changeReviewTagOptions, changeMenuTagOptions}) => {
    let bodyHtml = (
        <tr>
            <Td
                colSpan={titleKeyMap.length}
                className="pto-table__body--empty">
                No Match Result!
            </Td>
        </tr>
    );
    if (data.length > 0) {
        bodyHtml = data.map((review, bodyIndex) => {
            const cellHtml = titleKeyMap.map((header, cellIndex) => {
                let isAlignLeft = header['key'] === 'title';
                let className = isAlignLeft ? '' : 'bug-review-table__body--center';

                var resolvedReasonChange = function (type) {
                    resolvedReasonTypeChange(review, type);
                };
                var reviewTagChange = function (type){
                    changeReviewTagOptions(review, type);
                };
                var menuChange = function (type) {
                    changeMenuTagOptions(review, type);
                };
                var outBlurReviewText = function(event){
                    let value = event.target.value;
                    changeReviewText(review, value);
                };

                if ( header['key'] === 'resolved_type' ){
                    return (
                        <Td isAlignLeft="true" key={cellIndex}
                            className="bug-review-table__body--front"
                            colSpan={header['colspan']}>
                            <RadioGroup aryRadioConfig={resolvedReasonTypes} checkRadio="axapi" onRadioChange={resolvedReasonChange}/>
                        </Td>
                    );
                } else
                if ( header['key'] === 'tags' ){
                    return (
                        <Td isAlignLeft="true"
                            colSpan={header['colspan']}
                        >
                            <Select
                                multi={true}
                                name="resolved_tags"
                                value={review[header['key']]}
                                options={optionsReviewTags}
                                onChange={reviewTagChange}
                            />
                        </Td>
                    );
                } else
                if ( header['key'] === 'menu' ) {
                    return (
                        <Td isAlignLeft="true" colSpan={header['colspan']}>
                            <Select
                                name="menu_tag"
                                value={review[header['key']]}
                                options={optionsMenus}
                                onChange={menuChange}
                            />
                        </Td>
                    );
                } else
                if ( header['key'] === 'review') {
                    return (
                        <Td colSpan={header['colspan']}>
                            <textarea className="mdl-textfield__input" type="text" onBlur={outBlurReviewText} rows= "3" defaultValue={review[header['key']]}></textarea>
                        </Td>
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
        <tbody className="pto-table__body">
            {bodyHtml}
        </tbody>
    );
};

class BugReviewTable extends Component {
    constructor(props) {
        super(props);
        this._onSortHandler = ::this._onSortHandler;
    }
    _onSortHandler(e) {
        const category = e.target.dataset.name;
        this.props.onSortHandler(category);
    }
    render() {
        return (
            <div className="pto-table">
                <Table className="bug-review-table">
                    <TableHeaders {...this.props} />
                    <TableBody    {...this.props} />
                </Table>
            </div>
        );
    }
}

BugReviewTable.propTypes = {
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired,
    resolvedReasonTypes  : PropTypes.array.isRequired,
    optionsReviewTags    : PropTypes.array.isRequired,
    optionsMenus         : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func,
    resolvedReasonTypeChange: PropTypes.func,
    changeReviewTagOptions: PropTypes.func,
    changeMenuTagOptions: PropTypes.func,
    changeReviewText:   PropTypes.func
};

BugReviewTable.defaultProps = {
    enableSort: false,
    sortBy: {
        category: '',
        status: 0
    },
    onSortHandler        : () => {},
    onStatusUpdateHandler: () => {},
    onDeleteHandler      : () => {}
};

export default BugReviewTable;
