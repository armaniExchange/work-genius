import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import AssignmentCategoryTree from '../../components/AssignmentCategoryTree/AssignmentCategoryTree';
// Actions
import * as FeatureAnalysisActions from '../../actions/feature-analysis-actions';

import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import RaisedButton from 'material-ui/lib/raised-button';

class FeatureAnalysisPage extends Component {
    constructor(props){
      super(props);
      this.user = [{title:'Zli', 'value': 'zli'}];
      this.level = [
                  {title:'Very Hard', 'value':9},
                  {title:'Hard', 'value':7},
                  {title:'Medium', 'value':5},
                  {title:'Simple', 'value':3},
                  {title:'Easy', 'value':1},
                  {title:'Nothing', 'value':0},
                  ];
    }
    componentWillMount() {
        const { fetchAssignmentCategories } = this.props;
        fetchAssignmentCategories();
    }
    _onNodeClick() {
        const { setFormVisibility } = this.props;
        setFormVisibility(false);
    }
    _onLeafClick(data) {
        const { setCurrentLeafNode, setFormVisibility } = this.props;
        setFormVisibility(true);
        setCurrentLeafNode(data.id);
    }
    render() {
        const { treeDataSource, updateOneAssignmentCategory } = this.props;
        return (
            <div className="row">
                <div className="pull-left col-md-6">
                    <AssignmentCategoryTree
                            data={treeDataSource}
                            onNodeClick={::this._onNodeClick}
                            onLeafClick={::this._onLeafClick}/>
                </div>
                <div className="pull-right col-md-6">
                  <div className="form-horizontal">
                    <h3>Edit {this.props.curCategory}</h3>
                    <div className="col-xs-3">
                      Primary Owner: 
                    </div>
                    <div className="col-xs-9">
                      <DropDownList
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                          console.log(val);
                        }}
                        aryOptionConfig={this.user} />
                    </div>
                    <div className="col-xs-3">
                      Secondary Owner: 
                    </div>
                    <div className="col-xs-9">
                      <DropDownList
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                          console.log(val, 'val2');
                        }}
                        aryOptionConfig={this.user} />
                    </div>
                    <div className="col-xs-3">
                      Level: 
                    </div>
                    <div className="col-xs-9">
                      <DropDownList
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                          console.log(val, 'val3');
                        }}
                        aryOptionConfig={this.level} />
                    </div>
                    <div className="col-xs-3">
                    </div>
                    <div className="col-xs-9">
                      <RaisedButton label="Update" secondary={true} onClick={()=>{
                        console.log('submited');
                        console.log('updateOneAssignmentCategory', updateOneAssignmentCategory);
                      }} />
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

FeatureAnalysisPage.propTypes = {
    treeDataSource: PropTypes.object.isRequired,
    curCategory: PropTypes.string,
    updateOneAssignmentCategory: PropTypes.func.isRequired,
    fetchAssignmentCategories: PropTypes.func.isRequired,
    setCurrentLeafNode: PropTypes.func.isRequired,
    setFormVisibility: PropTypes.func.isRequired
};
FeatureAnalysisPage.defaultProps = {};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.featureAnalysis.toJS()
    );
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        {},
        bindActionCreators(FeatureAnalysisActions, dispatch)
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureAnalysisPage);
