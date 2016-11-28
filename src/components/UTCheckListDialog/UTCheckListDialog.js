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

const checkListReadyToRender = CHECK_LIST.reduce(addCategoriesAndSubCategories, []);

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
    let { data } = nextProps;
    data = data || {};
    const dictData = data.reduce((accum, current) => {
      accum[current.id] = Object.assign({}, current);
      return accum;
    }, {});

    const editingData = CHECK_LIST.reduce((accum, current)=>{
      accum[current.id] = dictData[current.id] || {
        checked: false,
        skipped: false
      };
      return accum;
    }, {});
    this.setState({ editingData });
  }

  onSubmit() {
    const {
      categoryId,
      onSubmit,
      onRequestClose
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

  render() {
    const {
      open,
      onRequestClose,
      categoryId,
      onCreateBugClick,
      onRemoveBugClick,
      fullpathWithOutRoot
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
        modal={false}
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
            checkListReadyToRender.map((item)=>{
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
              return (
                <tr key={id}>
                  <td style={nameStyle}>
                    {name}
                  </td>
                  <td>
                    {
                      isLeaf && (
                        <input type="checkbox"
                          checked={editingData[id] && editingData[id].checked}
                          onChange={this.onCheckedChange.bind(this, id)}
                        />
                      )
                    }
                  </td>
                  <td>
                    {
                      isLeaf && (
                        <input type="checkbox"
                          checked={editingData[id] && editingData[id].skipped}
                          onChange={this.onSkippedChange.bind(this, id)}
                        />
                      )
                    }
                  </td>
                  <td>
                    {
                      isLeaf && (
                        bugArgs.bugArticle ? (
                          <div>
                            <i className="UTCheckListDialog--create-new-bug fa fa-edit"
                              onClick={onCreateBugClick.bind(this, bugArgs)}
                            />
                            &nbsp;&nbsp;&nbsp;
                            <i className="UTCheckListDialog--create-new-bug fa fa-remove"
                              onClick={onRemoveBugClick.bind(this, bugArgs)}
                            />
                          </div>
                        ) : (
                          <i className="UTCheckListDialog--create-new-bug fa fa-plus"
                            onClick={onCreateBugClick.bind(this, bugArgs)}
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

