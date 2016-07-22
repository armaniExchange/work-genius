// Libraries
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

// Styles
import './_UTDocTaskRow.css';
import { TableRow, TableRowColumn } from 'material-ui/lib/table';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import moment from 'moment';

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
    if (editingDocStatus === 'DONE' && editingCodeStatus === 'DONE') {
     return <strong className="text-success">FINISHED</strong>;
    } else {
      return <strong className="text-primary">ASSIGNED</strong>;
    }
  }

  render() {
    const {
      fullpathWithOutRoot,
      owners,
      allUsers,
      readOnly,
      readOnlyText,
      isEmpty
    } = this.props;

    const {
      editingCodeETA,
      editingDocETA,
      editingCodeStatus,
      editingDocStatus,
    } = this.state;

    if (isEmpty) {
      return (
        <TableRow>
          <td style={{width: 48}}></td>
          <TableRowColumn>
            <div style={{textAlign: 'center', color: 'gray', paddingTop: 20, paddingBottom: 20}}>
              <i className="fa fa-file-text-o fa-3x"/>
              <h5>No matching items found.</h5>
            </div>
          </TableRowColumn>
        </TableRow>
      );
    }

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
        <TableRowColumn style={{width: 200}}>{ownersName.slice(1).join()}</TableRowColumn>
        <TableRowColumn style={{width: 150}}>
          {
            readOnly ? editingDocETA && <span title={readOnlyText}>{moment(editingDocETA).format('M/D/YYYY')}</span> : (
              <DatePicker
                hintText="Doc ETA"
                value={editingDocETA && new Date(editingDocETA)}
                onChange={::this.onDocETAChange} />
            )
          }
        </TableRowColumn>
        <TableRowColumn style={{width: 150}}>
        {
          readOnly ? <span title={readOnlyText}>{editingDocStatus}</span> : (
            <SelectField value={editingDocStatus || 'TODO'} onChange={::this.onDocStatusChange}>
              <MenuItem value={"TODO"} primaryText="TODO"/>
              <MenuItem value={"REVIEW"} primaryText="REVIEW"/>
              <MenuItem value ={"DONE"} primaryText="DONE"/>
            </SelectField>
          )
        }
        </TableRowColumn>
        <TableRowColumn style={{width: 150}}>
        {
          readOnly ? editingCodeETA && <span title={readOnlyText}>{moment(editingCodeETA).format('M/D/YYYY')}</span> : (
            <DatePicker
              hintText="Code ETA"
              value={editingCodeETA && new Date(editingCodeETA)}
              onChange={::this.onCodeETAChange} />
          )
        }
        </TableRowColumn>
        <TableRowColumn style={{width: 150}}>
        {
          readOnly ? <span title={readOnlyText}>{editingCodeStatus}</span>: (
            <SelectField value={editingCodeStatus || 'TODO'} onChange={::this.onCodeStatusChange}>
              <MenuItem value={"TODO"} primaryText="TODO"/>
              <MenuItem value={"REVIEW"} primaryText="REVIEW"/>
              <MenuItem value={"DONE"} primaryText="DONE"/>
            </SelectField>
          )
        }
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
  readOnly: PropTypes.bool,
  readOnlyText: PropTypes.string,
  isEmpty: PropTypes.bool,
};

UTDocTaskRow.defaultProps = {
  fullpathWithOutRoot: '',
  owners: [],
  docETA: null,
  docStatus: '',
  codeETA: null,
  codeStatus: '',
  allUsers: [],
  readOnly: false,
  isEmpty: false
};

export default UTDocTaskRow;
