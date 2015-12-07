import React, { Component, PropTypes } from 'react';
import { PTORecord } from '../../reducers/pto-reducer';

class PTOForm extends Component {

    constructor(props) {
        super(props);

        this._handleApplyPTO = ::this._handleApplyPTO;
    }

    _handleApplyPTO() {

        let startDate = this.refs.startDate;
        let toDate = this.refs.toDate;
        let memory = this.refs.memory;

        this.props.handleApplyPTO(new PTORecord({
            startDate: startDate.value,
            toDate: toDate.value,
            memory: memory.value
        }));
    }

    render() {

        return (
            <div>
                <h4>Apply A PTO</h4>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input className="mdl-textfield__input" type="text" ref="startDate" />
                                    <label className="mdl-textfield__label" htmlFor="startDate">Start Date</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input className="mdl-textfield__input" type="text" ref="toDate" />
                                    <label className="mdl-textfield__label" htmlFor="toDate">To Date</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="mdl-textfield mdl-js-textfield">
                                    <textarea className="mdl-textfield__input" type="text" rows="3" ref="memory"></textarea>
                                    <label className="mdl-textfield__label" htmlFor="memory">Memory</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this._handleApplyPTO}>
                                    Apply
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

PTOForm.propTypes = {
    newPTO: PropTypes.object.isRequired,
    handleApplyPTO: PropTypes.func.isRequired
};

export default PTOForm;
