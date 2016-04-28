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

  onCategorySave(/*newData*/) {
    // this.props.documentActions.upsertDocumentCategory(newData);
  }

  onCategoryDelete(/*id*/) {
    // this.props.documentActions.deleteDocumentCategory(id);
  }

  toggleSubCategories(id) {
    const { displayCategoriesId } = this.state;
    let result;
    if (displayCategoriesId.includes(id)) {
      result = displayCategoriesId.filter(eachId => eachId !== id);
    } else {
      result = [...displayCategoriesId, id];
    }
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
    const { documentCategories } = this.props;
    const displayTree = this.depthFirstFlat(documentCategories);
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
                onSave={::this.onCategorySave}
                onDelete={::this.onCategoryDelete}
                {...row} />
            );
          })
        }
      </div>
    );
  }
}

EditDocumentCategoryPage.propTypes = {
  documentCategories     : PropTypes.object,
  documentActions        : PropTypes.object.isRequired,
};

EditDocumentCategoryPage.defaultProps = {
  documentCategories     : PropTypes.object
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
