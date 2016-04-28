 // Style
import './_EditDocumentCategoryPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as DocumentActions from '../../actions/document-page-actions';

import CategoryRow from '../../components/CategoryRow/CategoryRow';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';

class EditDocumentCategoryPage extends Component {

  constructor(props) {
    super(props);
    this._counter = 0;
    this.state = { displayCategoriesId: [] };
  }

  componentDidMount() {
    this.props.documentActions.fetchDocumentCategories();
  }

  _onSaveHandler(newData) {
      this.props.documentActions.upsertDocumentCategory(newData);
  }

  _onDeleteHandler(id) {
      this.props.documentActions.deleteDocumentCategory(id);
  }

  toggleSubCategories({id}) {
    const {
      displayCategoriesId
    } = this.state;
    let result;
    if (displayCategoriesId.includes(id)) {
      result = displayCategoriesId.filter(eachId => eachId !== id);
    } else {
      result = [...displayCategoriesId, id];
    }
    console.log(`id: ${id}, result ${result}`);
    this.setState({displayCategoriesId: result});
  }

  depthFirstFlat(node) {
    const { displayCategoriesId } = this.state;
    node.level = node.level || 0;
    // console.log(`name: ${node.name}, level: ${node.level}`);
    if (node.subCategories && node.subCategories.length > 0 && (node.name === 'root' || displayCategoriesId.includes(node.id))) {
      node.expand = false;
      const modifiedSubCategories = node.subCategories.map(child => {
          return Object.assign({}, child, {level: node.level + 1});
        })
        .map(this.depthFirstFlat.bind(this))
        .reduce((prev, item) => [...prev, ...item], []);
      return [node, ...modifiedSubCategories];
    } else {
      node.expand = true;
      return [node];
    }
  }

  render() {
    const displayTree = this.depthFirstFlat(this.props.documentCategories);
    return (
      <div>
        <Breadcrumb data={BREADCRUMB.editDocumentCategory} />
        <h3>Knowledge Tree</h3>
        {
          displayTree.map(row => {
            return (
              <CategoryRow
                key={row.id}
                toggleSubCategories={::this.toggleSubCategories}
                {...row} />
            );
          })
        }

        <div>{/*JSON.stringify(documentCategories, undefined, 4)*/}</div>
        <button
          onClick={() => {
            this._counter += 1;
            ::this._onSaveHandler({
              id: '998', // THIS HAS TO BE STRING
              parentId: '2', // THIS HAS TO BE STRING
              name: `Test ${this._counter}`
            });
          }}>
          Save
        </button>
        <button
          onClick={() => {
            ::this._onDeleteHandler(998); // THIS CAN BE NUMBER OR STRING
          }}>
          Delete
        </button>
      </div>
    );
  }
}

EditDocumentCategoryPage.propTypes = {
  data                   : PropTypes.object,
  documentCategories     : PropTypes.object,
  documentActions        : PropTypes.object.isRequired,
};
const fakeData = {
  id: '1',
  name: 'root',
  children: [
    {
      id: '2',
      name: 'treeA'
    },
    {
      id: '3',
      name: 'treeB',
      children: [
        {
          id: '4',
          name: 'treeC'
        }
      ]
    },
  ]
};
EditDocumentCategoryPage.defaultProps = {
  data                   : fakeData
  // id                  : '',
  // content             : '',
  // author              : { id: '', name: ''},
  // tags                : [],
  // files               : [],
  // comments            : [],
  // content             : '',
  // createdAt           : 0,
  // updatedAt           : 0,
  // allCategories       : {}
};

function mapStateToProps(state) {
  const {
    documentCategories
  } = state.documentation.toJS();

  return Object.assign({}, {
    documentCategories
  });
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions: bindActionCreators(DocumentActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocumentCategoryPage);
