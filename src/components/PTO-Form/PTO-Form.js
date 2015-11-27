import React, { Component, PropTypes } from 'react';

class PTOForm extends Component {

    render() {
        return (
            <div>
                <h4>Apply A PTO</h4>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input className="mdl-textfield__input" type="text" id="startDate" />
                                    <label className="mdl-textfield__label" htmlFor="startDate">Start Date</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input className="mdl-textfield__input" type="text" id="toDate" />
                                    <label className="mdl-textfield__label" htmlFor="toDate">To Date</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="mdl-textfield mdl-js-textfield">
                                    <textarea className="mdl-textfield__input" type="text" rows= "3" id="memory" ></textarea>
                                    <label className="mdl-textfield__label" htmlFor="memory">Memory</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

PTOForm.propTypes = {
    data: PropTypes.array,
};

export default PTOForm;
