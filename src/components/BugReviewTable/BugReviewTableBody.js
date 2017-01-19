import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Td from '../A10-UI/Table/Td';
import Select from 'react-select';
class BugReviewTableBody extends Component {

    constructor(){
        super();
        this.state = {details: {}, name: '111'};
    }


    render () {
        const {
            data, titleKeyMap, resolvedReasonTypes, optionsReviewTags, optionsMenus, changeReviewText,
            optionsIntroduced,
            resolvedReasonTypeChange, changeReviewTagOptions, changeMenuTagOptions,
            changeIntroducedTagOptions
        } = this.props;

        var titleLength = 0;
        for (let key of titleKeyMap) {
            titleLength += key.colspan;
        }

        let bodyHtml = (
            <tr>
                <Td
                    colSpan={titleLength}
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
                    var introducedChange = function (type) {
                        let arr = type.split(',');
                        changeIntroducedTagOptions(review, arr);
                    };
                    var spanClassName = ' ';
                    var textareaClassName = 'mdl-textfield__input element-hide';
                    var outBlurReviewText = (event) => {
                        let value = event.target.value.replace(/\n/g, '\\n');
                        changeReviewText(review, value);
                        this.state.details[bugId] = value;
                        let textarea = ReactDOM.findDOMNode(this.refs[bugId + '-textarea']);
                        textareaClassName = 'mdl-textfield__input element-hide';
                        textarea.className = textareaClassName;
                        let span = ReactDOM.findDOMNode(this.refs[bugId + '-span']);
                        span.className = spanClassName;
                    };
                    var toEdit = () => {
                        let textarea = ReactDOM.findDOMNode(this.refs[bugId + '-textarea']);
                        textarea.value = this.state.details[bugId];
                        textareaClassName = 'mdl-textfield__input';
                        textarea.className = textareaClassName;
                        textarea.focus();
                        let span = ReactDOM.findDOMNode(this.refs[bugId + '-span']);
                        span.className = spanClassName + 'element-hide';
                    };
                    switch (header['key']){
                    case 'resolved_type':
                        return (
                            <Td key={cellIndex} isAlignLeft={true} colSpan={header['colspan']}>
                                <Select
                                    name="menu_tag"
                                    value={review[header['key']]}
                                    options={resolvedReasonTypes}
                                    onChange={resolvedReasonChange}
                                />
                            </Td>
                        );
                    case 'tags':
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
                    case 'menu':
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
                    case 'introduced_by':
                        let introduced = review[header['key']];
                        introduced = (introduced) ? introduced.join(',') : introduced;
                        return (
                            <Td key={cellIndex}
                                isAlignLeft={true}
                                colSpan={header['colspan']}
                            >
                                <Select
                                    value={introduced}
                                    name="menu_tag"
                                    options={optionsIntroduced}
                                    onChange={introducedChange}
                                />
                            </Td>
                        );
                    case 'review':
                        return (
                            <Td key={cellIndex} onClick={toEdit} isAlignLeft={true}  colSpan={header['colspan']}>
                                <span ref={bugId + '-span'} className={spanClassName} >{this.state.details[bugId]}</span>
                                <textarea className={textareaClassName}
                                type="text"
                                ref={bugId + '-textarea'}
                                onBlur={outBlurReviewText} rows= "3"></textarea>
                            </Td>
                        );
                    case 'id':
                        return (
                            <Td key={cellIndex}
                            isAlignLeft={isAlignLeft}
                            className={'pto-table__body--empty'}
                            colSpan={header['colspan']}>
                            <a className="bug-review-link" href={'https://bugzilla/show_bug.cgi?id=' + bugId} target="_Blank">
                                {review[header['key']]}</a></Td>
                        );
                    case 'title':
                        return (
                            <Td key={cellIndex}
                            isAlignLeft={isAlignLeft}
                            colSpan={header['colspan']}>
                                {review[header['key']]}</Td>
                        );
                    case 'resolved_status':
                        return (
                            <Td key={cellIndex}
                            className={'pto-table__body--empty'}
                            colSpan={header['colspan']}>
                            {review['bug_status']}<br/>{review['resolution']}</Td>
                        );
                    case 'assigned_to':
                        return (
                            <Td key={cellIndex}
                            className={'pto-table__body--empty'}
                            colSpan={header['colspan']}>{review[header['key']]}</Td>
                        );
                    default:
                        return (
                            <Td key={cellIndex}
                            isAlignLeft={isAlignLeft}
                            className={className}
                            colSpan={header['colspan']}>{review[header['key']]}</Td>
                        );
                    }
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
    optionsIntroduced    : PropTypes.array.isRequired,
    optionsMenus         : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func,
    resolvedReasonTypeChange: PropTypes.func,
    changeReviewTagOptions: PropTypes.func,
    changeMenuTagOptions: PropTypes.func,
    changeReviewText:   PropTypes.func,
    changeIntroducedTagOptions: PropTypes.func
};

export default BugReviewTableBody;
