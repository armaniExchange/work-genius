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
      this.user = [{title:'Zuoping', 'value': 'zli'}, 
                   {title:'Yuhua', 'value': 'yli'}
                  ];
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
        this.props.setCurrentLeafNode(undefined);
    }
    render() {
        const {
            currentLeaf,
            treeDataSource,
            updateOneAssignmentCategory,
            setCurrentLeafNode
        } = this.props;
        console.log('currentLeaf, this.user', currentLeaf, this.user);
        const displayForm = currentLeaf.id ? '' : 'none';
        const displayHint = currentLeaf.id ? 'none' : '';
        currentLeaf.primary_owner = 'yli';
        currentLeaf.secondary_owner = 'zli';
        currentLeaf.difficulty = 7;
        return (
            <div className="row">
                <div className="pull-left col-md-4">
            {currentLeaf.primary_owner}
            {currentLeaf.secondary_owner}
            {currentLeaf.difficulty}
                    <AssignmentCategoryTree
                            data={treeDataSource}
                            onNodeClick={::this._onNodeClick}
                            onLeafClick={setCurrentLeafNode}/>
                </div>
                <div className="pull-right col-md-8">
                  <div style={{display:displayHint, fontSize:'30px', padding:'30px 0'}}>
                    Please choose and click leaf in root tree.
                  </div>
                  <div className="form-horizontal" style={{display:displayForm}}>
                    <h5 style={{color:'#999'}}>{'Edit '}<span style={{color:'#000'}}>{currentLeaf.path}</span></h5>
                    <div className="col-xs-3">
                      Primary Owner:
                    </div>
                    <div className="col-xs-9">
                      <DropDownList
                        title={currentLeaf.primary_owner}
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
                        title={currentLeaf.secondary_owner}
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                          console.log(val, 'val2');
                        }}
                        aryOptionConfig={this.user} />
                    </div>
                    <div className="col-xs-3">
                      Difficulty:
                    </div>
                    <div className="col-xs-9">
                      <DropDownList
                        title={currentLeaf.difficulty}
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
    currentLeaf: PropTypes.object.isRequired,
    updateOneAssignmentCategory: PropTypes.func.isRequired,
    fetchAssignmentCategories: PropTypes.func.isRequired,
    setCurrentLeafNode: PropTypes.func.isRequired,
    setFormVisibility: PropTypes.func.isRequired
};
FeatureAnalysisPage.defaultProps = {
    currentLeaf: {}
};

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
