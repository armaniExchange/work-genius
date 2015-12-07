// Style
import './_PTOPage';

// React & Redux
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactBsTable from 'react-bootstrap-table';

// Components
import PTOForm from '../../components/PTO-Form/PTO-Form';
import PTOTable from '../../components/PTO-Table/PTO-Table';
import * as PTOActions from '../../actions/pto-page-actions';

var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

var products = [
  {
      id: 1,
      name: 'Product1',
      price: 120
  },{
      id: 2,
      name: 'Product2',
      price: 80
  }];

class PTOPage extends Component {

    render() {

        const { pto } = this.props;
        const { applyPTO } = this.props.ptoActions;

        return (
            <div>
                <section>PTO Page</section>
                <div className="mdl-grid">
                    <PTOForm handleApplyPTO={applyPTO}/>
                    <PTOTable data={pto.ptos} />
                </div>
                <BootstrapTable data={products} striped={true} hover={true} >
                    <TableHeaderColumn isKey={true} dataField="id" dataSort={true}>Product ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name" dataSort={true} >Product Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="price" dataSort={true}>Product Price</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

PTOPage.propTypes = {
    pto: PropTypes.object,
    ptoActions: PropTypes.object.isRequire,
};

export default connect(
    (state) => {
        return {
            pto: state.pto.toJS()
        };
    },
    (dispatch) => {
        return {
            ptoActions: bindActionCreators(PTOActions, dispatch)
        };
    }
)(PTOPage);
