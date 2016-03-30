import React, {Component, PropTypes} from 'react';

import Td from '../A10-UI/Table/Td';
import Select from 'react-select';
class BugReviewTableBody extends Component {

    constructor(){
        super();
        this.state = {details: {}, name: '111'};
    }


    render () {
        const {
            data, titleKeyMap, resolvedReasonTypes, optionsReviewTags, optionsMenus, changeReviewText, resolvedReasonTypeChange, changeReviewTagOptions, changeMenuTagOptions
        } = this.props;

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
                var bugId = review['id'];
                let causeDetail = review['review'];
                this.state.details[bugId] = causeDetail;
                const cellHtml = titleKeyMap.map((header, cellIndex) => {
                    let isAlignLeft = header['key'] === 'title';
                    let className = isAlignLeft ? '' : 'bug-review-table__body--center';

                    var resolvedReasonChange = function (type) {
                        resolvedReasonTypeChange(review, type);
                    };
                    var reviewTagChange = function (type){
                        let arr = type.split(',');
                        changeReviewTagOptions(review, arr);
                    };
                    var menuChange = function (type) {
                        let arr = type.split(',');
                        changeMenuTagOptions(review, arr);
                    };
                    var outBlurReviewText = function(event){
                        let value = event.target.value.replace(/\n/g, '\\n');
                        changeReviewText(review, value);
                    };

                    // var toEdit = (e) => {
                    //     console.log(e);
                    // };
                    // var loadText = () => {
                    //     console.log('sssssssssssss');
                    //     // this.refs[bugId].getDOMNode().value = this.state.details[bugId];
                    //     this.refs[bugId].getDOMNode().value = 'ssssss';
                    // };
                    // var onChangeText = (e) => {
                    //     this.state.name = e.target.value;
                    //     console.log(this.state.name);
                    //     this.refs[bugId].getDOMNode().value = e.target.value;
                    // }; <span onClick={toEdit}>{review[header['key']]}</span>

                    if ( header['key'] === 'resolved_type' ){
                        return (
                            //<Td isAlignLeft="true" key={cellIndex}
                            //    className="bug-review-table__body--front"
                            //   colSpan={header['colspan']}>
                            //   <RadioGroup aryRadioConfig={resolvedReasonTypes} checkRadio="axapi" onRadioChange={resolvedReasonChange}/>
                            //</Td>
                            <Td key={cellIndex} isAlignLeft={true} colSpan={header['colspan']}>
                                <Select
                                    name="menu_tag"
                                    value={review[header['key']]}
                                    options={resolvedReasonTypes}
                                    onChange={resolvedReasonChange}
                                />
                            </Td>
                        );
                    } else
                    if ( header['key'] === 'tags' ){
                        let tags = review[header['key']];
                        tags = (tags) ? tags.join(',') : tags;
                        return (
                            <Td key={cellIndex} isAlignLeft={true}
                                colSpan={header['colspan']}
                            >
                                <Select
                                    multi={true}
                                    allowCreate={true}
                                    name="resolved_tags"
                                    value={tags}
                                    options={optionsReviewTags}
                                    onChange={reviewTagChange}
                                />
                            </Td>
                        );
                    } else
                    if ( header['key'] === 'menu' ) {
                        let menu = review[header['key']];
                        menu = (menu) ? menu.join(',') : menu;
                        return (
                            <Td key={cellIndex} isAlignLeft={true} colSpan={header['colspan']}>
                                <Select
                                    name="menu_tag"
                                    value={menu}
                                    options={optionsMenus}
                                    onChange={menuChange}
                                />
                            </Td>
                        );
                    } else
                    if ( header['key'] === 'review') {
                        console.log(this.refs[bugId]);
                        return (
                            <Td key={cellIndex} colSpan={header['colspan']}>
                                <textarea className="mdl-textfield__input" type="text"
                                onBlur={outBlurReviewText} rows= "3" initialValue={review[header['key']]}></textarea>
                            </Td>
                        );
                    } else
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
            <tbody className="pto-table__body">
                {bodyHtml}
            </tbody>
        );
    }
}

BugReviewTableBody.propTypes = {
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

export default BugReviewTableBody;