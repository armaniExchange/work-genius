 // Style
import './_FeatureAutomationPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/lib/paper';

import * as DocumentActions from '../../actions/document-page-actions';

import depthFirstFlat from '../../libraries/depthFirstFlat';
import FeatureAutomationRow from '../../components/FeatureAutomationRow/FeatureAutomationRow';
import EditFeatureAutomationAxapiDialog from '../../components/EditFeatureAutomationAxapiDialog/EditFeatureAutomationAxapiDialog';

import Breadcrumb from '../../components/A10-UI/Breadcrumb';
import BREADCRUMB from '../../constants/breadcrumb';


class FeatureAutomationPage extends Component {

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

  openAxapisEditDialog({
    id,
    postAxapis,
    getAxapis,
    putAxapis,
    deleteAxapis,
  }) {
    this.setState({
      isAxapiEditDialogDisplay: true,
      editingCategoryId: id,
      postAxapis,
      getAxapis,
      putAxapis,
      deleteAxapis,
    });
  }

  closeAxapisEditDialog() {
    this.setState({ isAxapiEditDialogDisplay: false });
  }

  onAxapisSave({
    id,
    postAxapis,
    getAxapis,
    putAxapis,
    deleteAxapis
  }){
    console.log('onAxapisSave');
    console.log('id');
    console.log(id);
    console.log('postAxapis');
    console.log(postAxapis);
    console.log('getAxapis');
    console.log(getAxapis);
    console.log('putAxapis');
    console.log(putAxapis);
    console.log('deleteAxapis');
    console.log(deleteAxapis);
  };

  render() {
    const {
      documentCategories
    } = this.props;
    const {
      displayCategoriesId,
      isAxapiEditDialogDisplay,
      editingCategoryId,
      postAxapis,
      getAxapis,
      putAxapis,
      deleteAxapis,
    } = this.state;

    const displayTree = depthFirstFlat(documentCategories, (node) => {
      return node.name ==='root' || ( displayCategoriesId.includes(node.id));
    });

    return (
      <div>
        <Breadcrumb data={BREADCRUMB.editDocumentCategory} />
        <div className="feature-automation-page">
          <h3>Feature Automation</h3>
          <Paper className="table">
            <div className="table-header">
              <div className="table-row">
                <span>Category Name</span>
                <span>Pages</span>
                <span>Owners</span>
                <span>Complicate</span>
                <span>URL</span>
                <span>AXAPIs</span>
                <span>Unit Test Document</span>
                <span>Unit Test Code</span>
                <span>AXAPI Test cases</span>
              </div>
            </div>
            <div className="table-body">
              {
                displayTree.length > 0 ? displayTree.map(row => {
                  return (
                    <FeatureAutomationRow
                      key={row.id}
                      onEditAxapis={::this.openAxapisEditDialog}
                      toggleChildren={::this.toggleChildren}
                      {...row} />
                  );
                }) : (
                  <div style={{padding: 15, textAlign: 'center'}}>No data</div>
                )
              }
            </div>
          </Paper>
        </div>
        <EditFeatureAutomationAxapiDialog
          open={isAxapiEditDialogDisplay}
          id={editingCategoryId}
          postAxapis={postAxapis}
          getAxapis={getAxapis}
          putAxapis={putAxapis}
          deleteAxapis={deleteAxapis}
          onRequestClose={::this.closeAxapisEditDialog}
          onSubmit={::this.onAxapisSave}
        />
      </div>
    );
  }
}

FeatureAutomationPage.propTypes = {
  documentCategories       : PropTypes.object,
  documentActions          : PropTypes.object.isRequired
};

FeatureAutomationPage.defaultProps = {
};

function mapStateToProps(state) {
  const {
    documentCategories
  } = state.documentation.toJS();

  return { documentCategories };
}

function mapDispatchToProps(dispatch) {
  return {
    documentActions: bindActionCreators(DocumentActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureAutomationPage);