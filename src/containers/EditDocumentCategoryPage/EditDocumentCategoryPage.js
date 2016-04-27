 // Style
import './_EditDocumentCategoryPage.scss';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Table from 'material-ui/lib/table/table';
// import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
// import TableRow from 'material-ui/lib/table/table-row';
// import TableHeader from 'material-ui/lib/table/table-header';
// import TableRowColumn from 'material-ui/lib/table/table-row-column';
// import TableBody from 'material-ui/lib/table/table-body';
// import RaisedButton from 'material-ui/lib/raised-button';

// import HighlightMarkdown from '../../components/HighlightMarkdown/HighlightMarkdown';
// import ArticleEditor from '../../components/ArticleEditor/ArticleEditor';

// import * as ArticleActions from '../../actions/article-page-actions';
import * as DocumentActions from '../../actions/document-page-actions';

import CategoryRow from '../../components/CategoryRow/CategoryRow';


class EditDocumentCategoryPage extends Component {

  constructor(props) {
    super(props);
    const initDisplayTree = props.data.children;
    this.state = { displayTree: initDisplayTree };
  }

  componentDidMount() {
    this.props.documentActions.fetchDocumentCategories();

  }

  toggleChildren({id, level, isDisplayChildren, children}) {
    let { displayTree } = this.state;
    const parentIndex = displayTree.findIndex(row => row.id === id);

    if (isDisplayChildren) {
      const modefiedChildren = children.map(child => Object.assign({}, child, {level: level + 1}));
      displayTree.splice(parentIndex + 1, 0, ...modefiedChildren);
    } else {
      displayTree.splice(parentIndex + 1, children.length);
    }

    displayTree[parentIndex].isDisplayChildren = isDisplayChildren;

    this.setState({
      displayTree
    });
  }

  render() {
    const {
      displayTree
    } = this.state;
    const { documentCategories } = this.props;
    console.log(documentCategories);
    return (
      <div>
        <h3>Knowledge Tree</h3>
        {
          displayTree.map(row => {
            return (
              <CategoryRow
                key={row.id}
                toggleChildren={::this.toggleChildren}
                {...row} />
            );
          })
        }
        {
          /*
          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Category Name</TableHeaderColumn>
                <TableHeaderColumn>Article's Number</TableHeaderColumn>
                <TableHeaderColumn>Action</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>+ 3.2</TableRowColumn>
                <TableRowColumn>100</TableRowColumn>
                <TableRowColumn>
                  <a href="#">Add Child</a>&nbsp;&nbsp;|&nbsp;&nbsp;
                  <a href="#">Edit</a>&nbsp;&nbsp;|&nbsp;&nbsp;
                  <a href="#">Remove</a>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
           */
        }

      </div>
    );
  }
}

EditDocumentCategoryPage.propTypes = {
  data                   : PropTypes.object,
  documentCategories     : PropTypes.object,
  // id                  : PropTypes.string,
  // title               : PropTypes.string,
  // author              : PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
  // tags                : PropTypes.arrayOf(PropTypes.string),
  // files               : PropTypes.array,
  // categoryId          : PropTypes.string,
  // comments            : PropTypes.array,
  // content             : PropTypes.string,
  // documentType        : PropTypes.string,
  // priority            : PropTypes.string,
  // milestone           : PropTypes.string,
  // reportTo            : PropTypes.arrayOf(PropTypes.string),
  // createdAt           : PropTypes.number,
  // updatedAt           : PropTypes.number,
  // params              : PropTypes.object,
  // allCategories       : PropTypes.object,
  // allTags             : PropTypes.arrayOf(PropTypes.string),
  // isEditing           : PropTypes.bool,
  // articleActions      : PropTypes.object.isRequired,
  documentActions     : PropTypes.object.isRequired,
  // history             : PropTypes.object
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
