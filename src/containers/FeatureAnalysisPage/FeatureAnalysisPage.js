import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import AssignmentCategoryTree from '../../components/AssignmentCategoryTree/AssignmentCategoryTree';
// Actions
import * as FeatureAnalysisActions from '../../actions/feature-analysis-actions';

import DropDownList from '../../components/A10-UI/Input/Drop-Down-List.js';
import Select from 'react-select';
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
            updateMsgOpacity,
            currentLeaf,
            categoryWaitToUpdate,
            treeDataSource,
            updateOneAssignmentCategory,
            setCurrentLeafNode
        } = this.props;
        console.log('currentLeaf', currentLeaf);
        let user = aryOwners.map(item => {
            return {title:item.nickname, value: +item.id};
        });
        let difficulties = aryDifficulties.map(item => {
            return {
                title:item.difficulty && item.difficulty.title,
                value: item.difficulty && +item.difficulty.id
            };
        });
        let select_owner1_value = '', select_owner2_value='', select_difficulty_value='';
        let optUser = aryOwners.map(item => {
            if (+item.id === currentLeaf.primary_owner) {
                select_owner1_value = item.nickname;
            }
            if (+item.id === currentLeaf.secondary_owner) {
                select_owner2_value = item.nickname;
            }
            return {label:item.nickname, value: +item.id};
        });
        let optDifficulty = aryDifficulties.map(item => {
            if (item.difficulty && currentLeaf.difficulty && +item.difficulty.id===currentLeaf.difficulty.id) {
               select_difficulty_value = item.difficulty && item.difficulty.title;
            }
            return {label: item.difficulty && item.difficulty.title, 
                    value: item.difficulty && item.difficulty.id};
        });
        const displayForm = currentLeaf.id ? '' : 'none';
        const displayHint = currentLeaf.id ? 'none' : '';
        const difficultyTitle = currentLeaf.difficulty && currentLeaf.difficulty.id;
        const input_owner1_value = currentLeaf.primary_owner ? currentLeaf.primary_owner : '';
        const input_owner2_value = currentLeaf.secondary_owner ? currentLeaf.secondary_owner : '';
        const input_difficulty_value = currentLeaf.difficulty && currentLeaf.difficulty.id ? currentLeaf.difficulty.id : '';
        console.log('difficultyTitle----', difficultyTitle, currentLeaf.primary_owner, currentLeaf.secondary_owner, user, difficulties, '-----', input_owner1_value, input_owner2_value, input_difficulty_value, '===', select_owner1_value, select_owner2_value, select_difficulty_value);
        return (
            <div className="row">
                <div className="pull-left col-md-4">
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
                    <div className="col-xs-2" style={{paddingTop:'12px'}}>
                      Primary Owner:
                    </div>
                    <div className="col-xs-10">
                      <input type="hidden" ref="input_owner1" value={input_owner1_value} />
                      <Select ref="select_owner1"
                            value={select_owner1_value}
                            options={optUser}
                            onChange={(val) => {
                            this.refs.input_owner1.value = val;
                        }}
                        />
                      <DropDownList
                        title={currentLeaf.primary_owner}
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                            this.refs.input_owner1.value = val;
                        }}
                        aryOptionConfig={user} />
                    </div>
                    <div className="col-xs-2" style={{paddingTop:'12px'}}>
                      Secondary Owner:
                    </div>
                    <div className="col-xs-10">
                      <input type="hidden" ref="input_owner2" value={input_owner2_value} />
                      <Select ref="select_owner2"
                            value={select_owner2_value}
                            options={optUser}
                            onChange={(val) => {
                            this.refs.input_owner2.value = val;
                        }}
                        />
                      <DropDownList
                        title={currentLeaf.secondary_owner}
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                          this.refs.input_owner2.value = val;
                        }}
                        aryOptionConfig={user} />
                    </div>
                    <div className="col-xs-2" style={{paddingTop:'12px'}}>
                      Difficulty:
                    </div>
                    <div className="col-xs-10">
                      <input type="hidden" ref="input_difficulty" value={input_difficulty_value} />
                      <Select ref="select_difficulty"
                            value={select_difficulty_value}
                            options={optDifficulty}
                            onChange={(val) => {
                            this.refs.input_difficulty.value = val;
                        }}
                        />
                      <DropDownList
                        title={difficultyTitle}
                        isDropDownListVisual2={true}
                        isNeedAll={false}
                        onOptionClick={(val) => {
                          this.refs.input_difficulty.value = val;
                        }}
                        aryOptionConfig={difficulties} />
                    </div>
                    <div className="col-xs-2" style={{paddingTop:'12px'}}>
                    </div>
                    <div className="col-xs-10">
                      <RaisedButton label="Update" secondary={true} onClick={()=>{
                        console.log('this.refs.input_difficulty.value', this.refs.input_difficulty.value, this.refs.input_owner1.value, this.refs.input_owner2.value, this.refs.select_owner1.value, typeof this.refs.select_owner1.value);
                        return;
                        updateOneAssignmentCategory(currentLeaf.id, {
                            primary_owner: categoryWaitToUpdate.primary_owner,
                            secondary_owner: categoryWaitToUpdate.secondary_owner,
                            difficulty: categoryWaitToUpdate.difficulty
                        });
                      }} />
                      <div style={{opacity:updateMsgOpacity, 'transition': 'opacity 2s'}}>{'Update successfully'}</div>
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
    categoryWaitToUpdate: PropTypes.object,
    updateMsgOpacity: PropTypes.number.isRequired,
    aryOwners: PropTypes.array.isRequired,
    aryDifficulties: PropTypes.array.isRequired,
    updateOneAssignmentCategory: PropTypes.func.isRequired,
    fetchAssignmentCategories: PropTypes.func.isRequired,
    setCurrentLeafNode: PropTypes.func.isRequired,
    setFormVisibility: PropTypes.func.isRequired,
    fetchOwners: PropTypes.func.isRequired,
    fetchDifficulties: PropTypes.func.isRequired,
    changeCategoryWaitForUpdate: PropTypes.func.isRequired
};
FeatureAnalysisPage.defaultProps = {
    currentLeaf: {},
    aryOwners: [],
    aryDifficulties: [],
    updateMsgOpacity: 0,
    categoryWaitToUpdate: {},
    changeCategoryWaitForUpdate: () => {}
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
