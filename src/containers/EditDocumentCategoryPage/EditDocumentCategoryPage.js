 // Style
import './_EditDocumentCategoryPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/lib/paper';

import * as DocumentActions from '../../actions/document-page-actions';
import { depthFirstFlat } from '../../libraries/tree';
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

  render() {
    const { documentCategories, isLoading } = this.props;
    const { displayCategoriesId } = this.state;
    const displayTree = depthFirstFlat(documentCategories, (node) => {
      return node.name ==='root' || displayCategoriesId.includes(node.id);
    });
    return (
      <div>
        <Breadcrumb data={BREADCRUMB.editDocumentCategory} />
        <div className="edit-document-category-page">
          <h3>Knowledge Tree</h3>
          <Paper className="category-tree-edit-table">
            <div className="category-tree-edit-table-header">
              <div className="category-row">
                <span className="category-name">Category Name</span>
                <span className="is-feature">Is Feature</span>
                <span className="article-number">Article Number</span>
                <span className="action">Action</span>
              </div>
            </div>
            <div className="category-tree-edit-table-body">
              {
                displayTree.length > 0 ? displayTree.map(row => {
                  return (
                    <CategoryRow
                      key={row.id}
                      isLoading={isLoading}
                      toggleChildren={::this.toggleChildren}
                      onSave={::this.onCategorySave}
                      onRemove={::this.onCategoryRemove}
                      {...row} />
                  );
                }) : (
                  <div style={{padding: 15, textAlign: 'center'}}>No data</div>
                )
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
  documentActions          : PropTypes.object.isRequired,
  isLoading                : PropTypes.bool
};

EditDocumentCategoryPage.defaultProps = {
};

function mapStateToProps(state) {
  const {
    documentCategories
  } = state.documentation.toJS();
  const {
    isLoading,
  } = state.app.toJS();
  return {
    isLoading,
    documentCategories
  };
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
