// Libraries
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

// Styles
import './_UTDocTaskRow.css';
import { TableRow, TableRowColumn } from 'material-ui/lib/table';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

class UTDocTaskRow extends Component {

  constructor(props) {
    super(props);
    this.state = this.updateStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading === false && this.props.isLoading !== nextProps.isLoading) {
      this.setState(this.updateStateFromProps(nextProps));
    }
  }

  updateStateFromProps(props) {
    return {
      editingCodeETA: props.codeETA,
      editingDocETA: props.docETA,
      editingCodeStatus: props.codeStatus,
      editingDocStatus: props.docStatus,
    };
  }

  _save(option) {
    const { id, owners, fullpathWithOutRoot } = this.props;
    this.props.setupTestReportOfCategory({
      categoryId: id,
      ...option
    });
    const employee_id = owners && owners[0] ? owners[0] : '';
    if (employee_id && option.hasOwnProperty('docETA') || option.hasOwnProperty('codeETA')) {
      const prefixTitle = option.hasOwnProperty('docETA') ? 'UT Doc - ' : 'UT Code - ';
      const title = prefixTitle + fullpathWithOutRoot.slice(fullpathWithOutRoot.indexOf('>', fullpathWithOutRoot.indexOf('>') + 1) + 2);
      const end_date = option.hasOwnProperty('docETA') ? option.docETA : option.codeETA;
      const start_date = end_date - 2*24*60*60*1000; // three days agaon
      this.props.upsertWorklogItem({
        employee_id,
        data: {
          employee_id,
          title,
          start_date,
          end_date,
          progress: 0,
          duration: 24,
          tags: []
        }
      });
    }
  }

  save = _.debounce(::this._save, 1000)

  onCodeETAChange(event, eta) {
    const editingCodeETA = eta.getTime();
    this.setState({ editingCodeETA });
    this.save({codeETA: editingCodeETA});
  }

  onDocETAChange(event, eta) {
    const editingDocETA = eta.getTime();
    this.setState({ editingDocETA });
    this.save({docETA: editingDocETA});
  }

  onCodeStatusChange(event, index, value) {
    const editingCodeStatus = value;
    this.setState({ editingCodeStatus });
    this.save({codeStatus: editingCodeStatus});
  }

  onDocStatusChange(event, index, value) {
    const editingDocStatus = value;
    this.setState({ editingDocStatus });
    this.save({docStatus: editingDocStatus});
  }

  getOverallStatus(){
    const {
      editingDocStatus,
      editingCodeStatus
    } = this.state;
    if (!editingDocStatus && !editingCodeStatus) {
      return <strong className="text-warning">ASSIGNED</strong>;
    } else if (editingDocStatus === 'DONE' && editingCodeStatus === 'DONE') {
     return <strong className="text-success">FINISHED</strong>;
    } else {
      return <strong className="text-primary">ACTIVE</strong>;
    }
  }

  render() {
    const {
      fullpathWithOutRoot,
      owners,
      allUsers
    } = this.props;

    const {
      editingCodeETA,
      editingDocETA,
      editingCodeStatus,
      editingDocStatus,
    } = this.state;

    const ownersName = allUsers && allUsers.length > 0 ? owners.map(ownerId=>{
      const user = allUsers.filter(eachUser=> eachUser.id === ownerId);
      return user ? user[0] : 'undefined';
    })
    .map(eachUser=>eachUser.name) : owners;

    return (
      <TableRow>
        <td style={{width: 48}}></td>
        <TableRowColumn>{fullpathWithOutRoot}</TableRowColumn>
        <TableRowColumn style={{width: 150}}>{ownersName[0]}</TableRowColumn>
        <TableRowColumn style={{width: 150}}>{ownersName.slice(1).join()}</TableRowColumn>
        <TableRowColumn style={{width: 150}}>
          <DatePicker
            hintText="Doc ETA"
            value={editingDocETA && new Date(editingDocETA)}
            onChange={::this.onDocETAChange} />
        </TableRowColumn>
        <TableRowColumn style={{width: 150}}>
          <SelectField value={editingDocStatus || 'TODO'} onChange={::this.onDocStatusChange}>
            <MenuItem value={"TODO"} primaryText="TODO"/>
            <MenuItem value={"REVIEW"} primaryText="REVIEW"/>
            <MenuItem value ={"DONE"} primaryText="DONE"/>
          </SelectField>
        </TableRowColumn>
        <TableRowColumn style={{width: 150}}>
          <DatePicker
            hintText="Code ETA"
            value={editingCodeETA && new Date(editingCodeETA)}
            onChange={::this.onCodeETAChange} />
        </TableRowColumn>
        <TableRowColumn style={{width: 150}}>
          <SelectField value={editingCodeStatus || 'TODO'} onChange={::this.onCodeStatusChange}>
            <MenuItem value={"TODO"} primaryText="TODO"/>
            <MenuItem value={"REVIEW"} primaryText="REVIEW"/>
            <MenuItem value={"DONE"} primaryText="DONE"/>
          </SelectField>
        </TableRowColumn>
        <TableRowColumn style={{width: 120}}>{::this.getOverallStatus()}</TableRowColumn>
      </TableRow>
    );
  }
}

UTDocTaskRow.propTypes = {
  id: PropTypes.string,
  setupTestReportOfCategory: PropTypes.func.isRequired,
  upsertWorklogItem: PropTypes.func.isRequired,
  fullpathWithOutRoot: PropTypes.string,
  owners: PropTypes.array,
  docETA: PropTypes.number,
  docStatus: PropTypes.string,
  codeETA: PropTypes.number,
  codeStatus: PropTypes.string,
  allUsers: PropTypes.array,
  isLoading: PropTypes.bool,
};

UTDocTaskRow.defaultProps = {
  fullpathWithOutRoot: '',
  owners: [],
  docETA: null,
  docStatus: '',
  codeETA: null,
  codeStatus: '',
  allUsers: []
};

export default UTDocTaskRow;
