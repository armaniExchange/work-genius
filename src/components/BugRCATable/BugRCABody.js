import React, {Component, PropTypes} from 'react';

import Td from '../A10-UI/Table/Td';
import TextField from 'material-ui/lib/text-field';


class BugRCABody extends Component {
    constructor(){
        super();
        this.state = {data: []};
    }

    componentWillReceiveProps(nextProps) {
      const { data } = nextProps;
      if (data) {
        this.setState({
          data: data
        });
      }
    }

    changeInput(counter, event) {
      counter.bug_count = event.target.value;

      const { data } = this.state;
      data.map((con) => {
        if (con.employee_name === counter.employee_name) {
          con.bug_count = counter.bug_count;
        }
      });
      this.setState({data: data});
    }

    submitCount(counter) {
      const { bugRCAUpdate } = this.props;
      bugRCAUpdate(counter);
    }

    render () {
        const {
            titleKeyMap,
            currentUser
        } = this.props;
        const { data } = this.state;
        const supportEdit = currentUser.privilege === 10;
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
            bodyHtml = data.map((counter, bodyIndex) => {
                const cellHtml = titleKeyMap.map((header, cellIndex) => {
                    let isAlignLeft = header['key'] === 'title';
                    let className = isAlignLeft ? '' : 'bug-report-table__body--center';

                    if (header['key'] === 'bug_count' && supportEdit) {
                        className += ' table-bug-id-width';
                        return (
                            <Td key={cellIndex}
                            isAlignLeft={isAlignLeft}
                            className={className}
                            colSpan={header['colspan']}>
                              <TextField
                                onChange={::this.changeInput.bind(this, counter)}
                                onBlur={::this.submitCount.bind(this, counter)}
                                type="number" value={counter[header['key']]}
                              />
                            </Td>
                        );
                    }
                     return (
                        <Td key={cellIndex}
                        isAlignLeft={isAlignLeft}
                        className={className}
                        colSpan={header['colspan']}>{counter[header['key']]}</Td>
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

BugRCABody.propTypes = {
    currentUser          : PropTypes.object,
    data                 : PropTypes.array.isRequired,
    titleKeyMap          : PropTypes.array.isRequired,
    enableSort           : PropTypes.bool,
    sortBy               : PropTypes.object,
    bugRCAUpdate         : PropTypes.func,
    onSortHandler        : PropTypes.func,
    onStatusUpdateHandler: PropTypes.func,
    onDeleteHandler      : PropTypes.func
};

export default BugRCABody;
