// Libraries
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import CHECK_LIST from '../../constants/ut-check-list';
// Styles
import './_UTCheckListDialog.scss';


function addCategoriesAndSubCategories(accum, current, currentIndex) {
  const lastItem = accum.length > 1 && accum[accum.length - 1];
  if (!lastItem || current.category !== lastItem.category) {
    accum.push({
      id: `category-${currentIndex}`,
      isCategory: true,
      name: current.category
    });
  }
  if (current.subCategory !== lastItem.subCategory) {
    accum.push({
      id: `subCategory-${currentIndex}`,
      isSubCategory: true,
      name: current.subCategory
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
    const { data } = nextProps;
    const editingData = CHECK_LIST.reduce((accum, current)=>{
      accum[current.id] = accum[current.id] || {
        pass: false,
        fail: false
      };
      return accum;
    }, data ? Object.assign({}, data) : {});
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

    onSubmit({
      categoryId,
      data: editingData
    });
    onRequestClose();
  }

  onCancel() {
    const {
      onRequestClose,
    } = this.props;
    onRequestClose();
  }

  onPassChange(id) {
    const {
      editingData
    } = this.state;
    let newEditingData = Object.assign({}, editingData);
    newEditingData[id].pass = !editingData[id].pass;
    if (newEditingData[id].pass) {
      newEditingData[id].fail = false;
    }
    this.setState({
      editingData: newEditingData
    });
  }

  onFailChange(id) {
    const {
      editingData
    } = this.state;
    let newEditingData = Object.assign({}, editingData);
    newEditingData[id].fail = !editingData[id].fail;
    if (newEditingData[id].fail) {
      newEditingData[id].pass = false;
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
              <th>Pass</th>
              <th>Fail</th>
              <th>Bug</th>
            </tr>
          </thead>
          <tbody>
          {
            checkListReadyToRender.map((item)=>{
              const {
                id,
                name,
                isCategory,
                isSubCategory,
              } = item;
              const isLeaf = !isCategory && !isSubCategory;
              const fontSize = isLeaf ? '1.2rem' : '1rem';
              const paddingLeft = isCategory ? 0 : 8;
              const nameStyle = {
                fontSize,
                paddingLeft,
                fontWeight: isLeaf ? 'normal' : 'bold',
              };
              const createBugArgs = {
                categoryId, fullpathWithOutRoot,
                bugArticle: (editingData && editingData[id]) ? editingData[id].bugArticle : null,
                checkListId: id
              };
              return (
                <tr key={id}>
                  <td style={nameStyle}>
                    {name}
                  </td>
                  <td>
                    {
                      isLeaf ? (
                        <input type="checkbox"
                          checked={editingData[id] && editingData[id].pass}
                          onChange={this.onPassChange.bind(this, id)}
                        />
                      ) : ''
                    }
                  </td>
                  <td>
                    {
                      isLeaf ? (
                        <input type="checkbox"
                          checked={editingData[id] && editingData[id].fail}
                          onChange={this.onFailChange.bind(this, id)}
                        />
                      ) : ''
                    }
                  </td>
                  <td>
                    {
                      isLeaf ? (
                        <i className="UTCheckListDialog--create-new-bug fa fa-plus"
                          onClick={onCreateBugClick.bind(this, createBugArgs)}
                        />
                      ): ''
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
  data                : PropTypes.object,
  onRequestClose      : PropTypes.func.isRequired,
  onSubmit            : PropTypes.func.isRequired,
  onCreateBugClick    : PropTypes.func
};

UTCheckListDialog.defaultProps = {
  data: {}
};

export default UTCheckListDialog;

