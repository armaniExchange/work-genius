 // Style
import './_EditDocumentCategoryPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/lib/paper';

import * as DocumentActions from '../../actions/document-page-actions';

import CategoryRow from '../../components/CategoryRow/CategoryRow';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';


class EditDocumentCategoryPage extends Component {

  constructor(props) {
    super(props);
    this.state = { displayCategoriesId: [] };
  }

  componentDidMount() {
    this.props.documentActions.fetchDocumentCategories();
  }

  onCategorySave(newData) {
    this.props.documentActions.upsertDocumentCategory(newData);
  }

  onCategoryRemove(id) {
    this.props.documentActions.deleteDocumentCategory(id);
  }

  toggleChildren({id, forceEnable}) {
    const { displayCategoriesId } = this.state;
    let result = displayCategoriesId;
    if (displayCategoriesId.includes(id)) {
      if (forceEnable === true) {
        // skip remove, keep it in displayCategoriesId
      } else {
        result = displayCategoriesId.filter(eachId => eachId !== id);
      }
    } else {
      result = [...displayCategoriesId, id];
    }
    this.setState({displayCategoriesId: result});
  }

  depthFirstFlat(node) {
    const { displayCategoriesId } = this.state;
    node.level = node.level || 0;
    if (node.children && node.children.length > 0 && (node.name === 'root' || displayCategoriesId.includes(node.id))) {
      node.collapsed = false;
      const modifiedChildren = node.children.map(child => {
          return Object.assign({}, child, {level: node.level + 1});
        })
        .map(this.depthFirstFlat.bind(this))
        .reduce((prev, item) => [...prev, ...item], []);
      return [node, ...modifiedChildren];
    } else {
      node.collapsed = true;
      return [node];
    }
  }

  render() {
    const {
        documentCategories,
        documentCategoriesLength
     } = this.props;
    const displayTree = this.depthFirstFlat(documentCategories);
    return (
      <div>
        <Breadcrumb data={BREADCRUMB.editDocumentCategory} />
        <div className="edit-document-category-page">
          <h3>Knowledge Tree</h3>
          <Paper className="category-tree-edit-table">
            <div className="category-tree-edit-table-header">
              <div className="category-tree-edit-table-row">
                <span className="category-name">Category Name</span>
                <span className="article-number">Article Number</span>
                <span className="action">Action</span>
              </div>
            </div>
            <div className="category-tree-edit-table-body">
              {
                displayTree.map(row => {
                  return (
                    <CategoryRow
                      lastId={documentCategoriesLength + ''}
                      key={row.id}
                      toggleChildren={::this.toggleChildren}
                      onSave={::this.onCategorySave}
                      onRemove={::this.onCategoryRemove}
                      {...row} />
                  );
                })
              }
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

EditDocumentCategoryPage.propTypes = {
  documentCategories       : PropTypes.object,
  documentCategoriesLength : PropTypes.number,
  documentActions          : PropTypes.object.isRequired
};

EditDocumentCategoryPage.defaultProps = {
  documentCategories     : PropTypes.object
};

function mapStateToProps(state) {
  const {
    documentCategories,
    documentCategoriesLength
  } = state.documentation.toJS();

  return Object.assign({}, {
    documentCategories,
    documentCategoriesLength
  });
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions: bindActionCreators(DocumentActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocumentCategoryPage);
