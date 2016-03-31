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
    }
    componentWillMount() {
        const { fetchAssignmentCategories, fetchOwners, fetchDifficulties } = this.props;
        fetchAssignmentCategories();
        fetchOwners();
        fetchDifficulties();
    }
    _onNodeClick() {
        this.props.setCurrentLeafNode(undefined);
    }
    render() {
        const {
            aryOwners,
            aryDifficulties,
            currentLeaf,
            treeDataSource,
            updateOneAssignmentCategory,
            setCurrentLeafNode
        } = this.props;
        let user = aryOwners.map(item => {
            return {title:item.nickname, value: item.id};
        });
        let difficulties = aryDifficulties.map(item => {
            return {
                title:item.difficulty && item.difficulty.title, 
                value: item.difficulty && item.difficulty.id
            };
        });
        console.log('currentLeaf, this.user', currentLeaf, user, difficulties);
        const displayForm = currentLeaf.id ? '' : 'none';
        const displayHint = currentLeaf.id ? 'none' : '';
        const difficultyTitle = currentLeaf.difficulty && currentLeaf.difficulty.title;
        return (
            <div className="row">
                <div className="pull-left col-md-4">
            {currentLeaf.primary_owner}
            {currentLeaf.secondary_owner}
            {difficultyTitle}
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
                        aryOptionConfig={user} />
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
                        aryOptionConfig={user} />
                    </div>
                    <div className="col-xs-3">
                      Difficulty:
                    </div>
                    <div className="col-xs-9">
                      <DropDownList
                        title={difficultyTitle}
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                          console.log(val, 'val3');
                        }}
                        aryOptionConfig={difficulties} />
                    </div>
                    <div className="col-xs-3">
                    </div>
                    <div className="col-xs-9">
                      <RaisedButton label="Update" secondary={true} onClick={()=>{
                        console.log('submited');
                        updateOneAssignmentCategory();
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
    aryOwners: PropTypes.array.isRequired,
    aryDifficulties: PropTypes.array.isRequired,
    updateOneAssignmentCategory: PropTypes.func.isRequired,
    fetchAssignmentCategories: PropTypes.func.isRequired,
    setCurrentLeafNode: PropTypes.func.isRequired,
    setFormVisibility: PropTypes.func.isRequired,
    fetchOwners: PropTypes.func.isRequired,
    fetchDifficulties: PropTypes.func.isRequired
};
FeatureAnalysisPage.defaultProps = {
    currentLeaf: {},
    aryOwners: [],
    aryDifficulties: []
};

function mapStateToProps(state) {
    return Object.assign(
        {},
        state.featureAnalysis.toJS(),
        state.app.toJS()
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
