// Libraries
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import CHECK_LIST from '../../constants/ut-check-list';
// Styles
import './_UTCheckListDialog.scss';


function addCategoriesAndSubCategories(accum, current, currentIndex) {
  const lastItem = accum.length > 1 && accum[accum.length - 1];
  if (!lastItem || current.type !== lastItem.type) {
    accum.push({
      id: `type-${currentIndex}`,
      isType: true,
      name: current.type
    });
  }
  if (current.subType !== lastItem.subType) {
    accum.push({
      id: `subType-${currentIndex}`,
      isSubType: true,
      name: current.subType,
      type: current.type,
      subType: current.subType
    });
  }
  accum.push(current);
  return accum;
}

const getCheckListReadyToRender = (checkListDefinition = 'default') =>{
  return CHECK_LIST(checkListDefinition).reduce(addCategoriesAndSubCategories, []);
};

class UTCheckListDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingData: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      return;
    }
    let { data, checkListDefinition } = nextProps;
    data = data || [];
    const dictData = data.reduce((accum, current) => {
      accum[current.id] = Object.assign({}, current);
      return accum;
    }, {});

    const editingData = CHECK_LIST(checkListDefinition).reduce((accum, current)=>{
      accum[current.id] = dictData[current.id] || {
        checked: false,
        skipped: false
      };
      accum[current.id].checked = (accum[current.id].checked === true);
      accum[current.id].skipped = (accum[current.id].skipped === true);
      return accum;
    }, {});
    this.setState({ editingData });
  }

  _submit() {
    const {
      categoryId,
      onSubmit
    } = this.props;
    const {
      editingData
    } = this.state;

    const listData = Object.keys(editingData).map((id)=>{
      const editingItemData = Object.assign({}, editingData[id]);
      if (!editingItemData.bugArticle) {
        delete editingItemData.bugArticle;
      }
      return Object.assign({}, editingItemData, {id});
    });

    onSubmit({
      categoryId,
      data: listData
    });
  }

  onSubmit() {
    const { onRequestClose } = this.props;
    this._submit();
    onRequestClose();
  }

  onCancel() {
    const {
      onRequestClose,
    } = this.props;
    onRequestClose();
  }

  onCheckedChange(id) {
    const {
      editingData
    } = this.state;
    let newEditingData = Object.assign({}, editingData);
    newEditingData[id].checked = !editingData[id].checked;
    if (newEditingData[id].checked) {
      newEditingData[id].skipped = false;
    }
    this.setState({
      editingData: newEditingData
    });
  }

  onSkippedChange(id) {
    const {
      editingData
    } = this.state;
    let newEditingData = Object.assign({}, editingData);
    newEditingData[id].skipped = !editingData[id].skipped;
    if (newEditingData[id].skipped) {
      newEditingData[id].checked = false;
    }
    this.setState({
      editingData: newEditingData
    });
  }

  onCreateBugClick(bugArgs, isNew){
    const { onCreateBugClick, onRequestClose } = this.props;
    const answer = window.confirm( isNew ?
      `Save check list and create a bug?` : `Save check list and view the bug?`);
    if (answer) {
      this._submit();
      onCreateBugClick(bugArgs);
      onRequestClose();
    }
  }

  render() {
    const {
      open,
      onRequestClose,
      categoryId,
      onRemoveBugClick,
      fullpathWithOutRoot,
      checkListDefinition
    } = this.props;
    const {
      editingData
    } = this.state;

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={::this.onCancel}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={::this.onSubmit}
      />,
    ];

    return (
      <Dialog
        title={`CheckList ${fullpathWithOutRoot}`}
        className="UTCheckListDialog"
        actions={actions}
        modal={true}
        open={open}
        onRequestClose={onRequestClose}
        autoScrollBodyContent={true}
      >
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Checked</th>
              <th>Skipped</th>
              <th>Bug</th>
            </tr>
          </thead>
          <tbody>
          {
            getCheckListReadyToRender(checkListDefinition).map((item)=>{
              const {
                id,
                name,
                isType,
                isSubType,
                type,
                subType
              } = item;
              const isLeaf = !isType && !isSubType;
              const fontSize = isLeaf ? '1.2rem' : '1rem';
              const paddingLeft = isType ? 0 : 8;
              const nameStyle = {
                fontSize,
                paddingLeft,
                fontWeight: isLeaf ? 'normal' : 'bold',
              };
              const bugArgs = {
                categoryId, fullpathWithOutRoot,
                bugArticle: (editingData && editingData[id]) ? editingData[id].bugArticle : null,
                checkListId: id,
                name,
                type,
                subType
              };
              const labelStyle = {
                width: '100%',
                margin: 0
              };
              return (
                <tr key={id}>
                  <td style={nameStyle}>
                    {name}
                  </td>
                  <td>
                    {
                      isLeaf && (
                        <label style={labelStyle}>
                          <input type="checkbox"
                            checked={editingData[id] && editingData[id].checked}
                            onChange={this.onCheckedChange.bind(this, id)}
                          />
                        </label>
                      )
                    }
                  </td>
                  <td>
                    {
                      isLeaf && (
                        <label style={labelStyle}>
                          <input type="checkbox"
                            checked={editingData[id] && editingData[id].skipped}
                            onChange={this.onSkippedChange.bind(this, id)}
                          />
                        </label>
                      )
                    }
                  </td>
                  <td>
                    {
                      isLeaf && (
                        bugArgs.bugArticle ? (
                          <div>
                            <i className="UTCheckListDialog--create-new-bug fa fa-edit"
                              onClick={this.onCreateBugClick.bind(this, bugArgs, false)}
                            />
                            &nbsp;&nbsp;&nbsp;
                            <i className="UTCheckListDialog--create-new-bug fa fa-remove"
                              onClick={onRemoveBugClick.bind(this, bugArgs)}
                            />
                          </div>
                        ) : (
                          <i className="UTCheckListDialog--create-new-bug fa fa-plus"
                            onClick={this.onCreateBugClick.bind(this, bugArgs, true)}
                          />
                        )
                      )
                    }
                  </td>
                </tr>
              );
            })
          }
          </tbody>
        </table>
      </Dialog>
    );
  }
}


UTCheckListDialog.propTypes = {
  categoryId          : PropTypes.string,
  fullpathWithOutRoot : PropTypes.string,
  title               : PropTypes.string,
  checkListDefinition : PropTypes.string,
  open                : PropTypes.bool,
  data                : PropTypes.array,
  onRequestClose      : PropTypes.func.isRequired,
  onSubmit            : PropTypes.func.isRequired,
  onCreateBugClick    : PropTypes.func,
  onRemoveBugClick    : PropTypes.func
};

UTCheckListDialog.defaultProps = {
  data: []
};

export default UTCheckListDialog;

