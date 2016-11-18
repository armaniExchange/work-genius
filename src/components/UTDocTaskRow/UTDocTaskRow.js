// Libraries
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { TableRow, TableRowColumn } from 'material-ui/lib/table';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import moment from 'moment';

// Styles
import './_UTDocTaskRow.css';

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
    const { id, owners, fullpathWithOutRoot, docETA, codeETA } = this.props;
    this.props.setupTestReportOfCategory({
      categoryId: id,
      ...option
    });
    const employee_id = owners && owners[0] ? owners[0] : '';
    if (employee_id && option.hasOwnProperty('docETA') || option.hasOwnProperty('codeETA')) {
      const isUnchanged = option.hasOwnProperty('docETA') ? docETA === option.docETA : codeETA ===  option.codeETA;
      if (isUnchanged) {
        return;
      }
      const hasETABefore = option.hasOwnProperty('docETA') ? docETA !== null : codeETA !== null;
      let answer = true;
      if (hasETABefore) {
        answer = window.confirm(`You've changed the ETA, Do you want to add NEW task in resource map?`);
      }

      if (answer) {
        const prefixTitle = option.hasOwnProperty('docETA') ? 'UT Doc - ' : 'UT Code - ';
        const title = prefixTitle + fullpathWithOutRoot.slice(fullpathWithOutRoot.indexOf('>', fullpathWithOutRoot.indexOf('>') + 1) + 2);
        const end_date = option.hasOwnProperty('docETA') ? option.docETA : option.codeETA;
        const start_date = end_date;
        this.props.upsertWorklogItem({
          employee_id,
          data: {
            employee_id,
            title,
            start_date,
            end_date,
            progress: 0,
            duration: 4,
            tags: []
          }
        });
      }
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

  // onUTDocClick() {
  //   const {
  //     id,
  //     onUTDocClick,
  //     UTDoc,
  //     fullpathWithOutRoot,
  //   } = this.props;
  //   onUTDocClick({
  //     UTDoc,
  //     categoryId: id,
  //     fullpathWithOutRoot,
  //   });
  // }

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

  renderCheckListStatistic() {
    const { isCheckListChecked } = this.props;
    if (isCheckListChecked){
      return (<strong className="text-success">Checked</strong>);
    } else {
      return (<strong className="text-primary">Check</strong>);
    }
  }

  renderBugs() {
    return null;
  }

  render() {
    const {
      id,
      fullpathWithOutRoot,
      owners,
      allUsers,
      readOnly,
      readOnlyText,
      isEmpty,
      // UTDoc,
      openCheckList,
      checkList
    } = this.props;

    const {
      editingCodeETA,
      // editingDocETA,
      editingCodeStatus,
      // editingDocStatus,
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
    .map(eachUser=> eachUser && eachUser.name) : owners;

    return (
      <TableRow>
        <TableRowColumn style={{minWidth: 100}}>
          <span title={fullpathWithOutRoot}>{fullpathWithOutRoot}</span>
        </TableRowColumn>
        <TableRowColumn style={{width: 150}}>{ownersName[0]}</TableRowColumn>
        <TableRowColumn style={{width: 200}}>{ownersName.slice(1).join()}</TableRowColumn>
        <TableRowColumn style={{width: 120}}>
          <span onClick={openCheckList.bind(this, {id, checkList, fullpathWithOutRoot})}>
            {this.renderCheckListStatistic()}
          </span>
        </TableRowColumn>
        <TableRowColumn style={{width: 120}}>
          {this.renderBugs()}
        </TableRowColumn>
        <TableRowColumn style={{width: 130}}>
        {
          readOnly ? editingCodeETA && <span title={readOnlyText}>{moment(editingCodeETA).format('M/D/YYYY')}</span> : (
            <DatePicker
              hintText="Code ETA"
              value={editingCodeETA && new Date(editingCodeETA)}
              onChange={::this.onCodeETAChange} />
          )
        }
        </TableRowColumn>
        <TableRowColumn style={{width: 130}}>
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
  setupTestReportOfCategory: PropTypes.func,
  upsertWorklogItem: PropTypes.func,
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
  UTDoc: PropTypes.string,
  onUTDocClick: PropTypes.func,
  openCheckList: PropTypes.func,
  checkList: PropTypes.object,
  isCheckListChecked: PropTypes.bool
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
  isEmpty: false,
  UTDoc: null,
  checkList: {},
  isCheckListChecked: false
};


export default UTDocTaskRow;
