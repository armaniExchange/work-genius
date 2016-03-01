/**
 * @author Howard Chang
 */
// Libraries
import React, { Component, PropTypes } from 'react';
import {Panel, Input, Col} from 'react-bootstrap';

import './Privilege-Table.css';
import { PRIVILEGE } from '../../constants/config.js';

class PrivilegeTable extends Component {

  constructor(props) {
    super(props);
    this._onChange = ::this._onChange;
  }

  _onChange(event){
    this.props.updateUserPrivilege(event.target.dataset.userId, event.target.value);
  }

  renderPrivilegeSelect(userId, defaultValue) {
    const {GUI_TEAM_MEMBER, ADMIN} = PRIVILEGE;
    const options = [...Array(10).keys()].map(privilege => {
      return {
        value:privilege,
        name: privilege < GUI_TEAM_MEMBER ? 'user' :
              privilege >= GUI_TEAM_MEMBER && privilege < ADMIN ? 'Team member' :
              'admin'
      };
    });

    return (
      <Input className="priviliege-dropdown" type="select" defaultValue={defaultValue} data-user-id={userId} onChange={this._onChange}>
        {
          options.map((optionItem)=>{
            return (
              <option
                value={optionItem.value}
                key={optionItem.value}>{optionItem.value}:{optionItem.name}</option>
            );
          })
        }

      </Input>
    );
  }

	render() {
    const {data} = this.props;

		return (
			<div>
        {
          data.map((user)=>{
            return (
              <Panel key={user.id}>
                <Col xs={12} md={8}><h5>{user.name}</h5></Col>
                <Col xs={12} md={4}>
                  {this.renderPrivilegeSelect(user.id, user.privilege)}
                </Col>
              </Panel>
            );
          })
        }
      </div>
		);
	}
}

PrivilegeTable.propTypes = {
	data: PropTypes.array.isRequired,
	titleKeyMap: PropTypes.array.isRequired,
  updateUserPrivilege: PropTypes.func.isRequired
};

PrivilegeTable.defaultProps = {};

export default PrivilegeTable;
