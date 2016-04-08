import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import AssignmentCategoryTree from '../../components/AssignmentCategoryTree/AssignmentCategoryTree';
import Select from 'react-select';
import RaisedButton from 'material-ui/lib/raised-button';
// Actions
import * as FeatureAnalysisActions from '../../actions/feature-analysis-actions';

function TreeFilter({ value, options, onChangeHandler }) {
    return (
        <div style={{width:'200px', paddingBottom:'10px'}}>
            <Select
                value={value}
                options={options}
                onChange={onChangeHandler} />
        </div>
    );
}

class FeatureAnalysisTreePage extends Component {
    constructor(props){
      super(props);
    }
    componentWillMount() {
        const { fetchAnalysisPageData } = this.props;
        fetchAnalysisPageData();
    }
    _onNodeClick() {
        this.props.setCurrentLeafNode(undefined);
    }
    _onTreeFilterChange(val) {
        const { fetchAssignmentCategories } = this.props;
        fetchAssignmentCategories(val);
    }
    render() {
        const {
            aryOwners,
            aryDifficulties,
            updateMsgOpacity,
            currentLeaf,
            treeDataSource,
            updateOneAssignmentCategory,
            setCurrentLeafNode
        } = this.props;
        let select_owner1_value = '', select_owner2_value='', select_difficulty_value='';
        let optUser = aryOwners.map(item => {
            if (+item.id === currentLeaf.primary_owner) {
                select_owner1_value = item.name;
            }
            if (+item.id === currentLeaf.secondary_owner) {
                select_owner2_value = item.name;
            }
            return {label:item.name, value: +item.id};
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
        const input_owner1_value = currentLeaf.primary_owner ? currentLeaf.primary_owner : '';
        const input_owner2_value = currentLeaf.secondary_owner ? currentLeaf.secondary_owner : '';
        const input_difficulty_value = currentLeaf.difficulty && currentLeaf.difficulty.id ? currentLeaf.difficulty.id : '';

        return (
            <div className="row">
                <div className="col-md-4">
                    <TreeFilter
                        value="328275"
                        options={optUser}
                        onChangeHandler={::this._onTreeFilterChange}/>
                    <AssignmentCategoryTree
                            data={treeDataSource}
                            owners={aryOwners}
                            selectedId={currentLeaf.id}
                            onNodeClick={::this._onNodeClick}
                            onLeafClick={setCurrentLeafNode}/>
                </div>
                <div className="col-md-8">
                    <div style={{display:displayHint, fontSize:'30px', margin:'90px 0', textDecoration:'underline'}}>
                        &laquo; Please choose and click leaf in root tree.
                    </div>
                    <div className="form-horizontal" style={{display:displayForm}}>
                        <h5 style={{color:'#9cf'}}>{'Edit '}<span style={{color:'#000'}}>{currentLeaf.path}</span></h5>
                        <div className="col-xs-3" style={{paddingTop:'12px'}}>
                            Primary Owner:
                        </div>
                        <div className="col-xs-9">
                            <input type="hidden" ref="input_owner1" value={input_owner1_value} />
                            <div style={{width:'200px', paddingBottom:'10px'}}>
                                <Select
                                    ref="select_owner1"
                                    value={select_owner1_value}
                                    options={optUser}
                                    onChange={(val) => {
                                        this.refs.input_owner1.value = val;
                                    }} />
                            </div>
                        </div>
                        <div className="col-xs-3" style={{paddingTop:'12px'}}>
                            Secondary Owner:
                        </div>
                        <div className="col-xs-9">
                            <input type="hidden" ref="input_owner2" value={input_owner2_value} />
                            <div style={{width:'200px', paddingBottom:'10px'}}>
                                <Select
                                    ref="select_owner2"
                                    value={select_owner2_value}
                                    options={optUser}
                                    onChange={(val) => {
                                        this.refs.input_owner2.value = val;
                                    }} />
                            </div>
                        </div>
                        <div className="col-xs-3" style={{paddingTop:'12px'}}>
                            Difficulty:
                        </div>
                        <div className="col-xs-9">
                            <input type="hidden" ref="input_difficulty" value={input_difficulty_value} />
                            <div style={{width:'200px', paddingBottom:'10px'}}>
                                <Select
                                    ref="select_difficulty"
                                    value={select_difficulty_value}
                                    options={optDifficulty}
                                    onChange={(val) => {
                                        this.refs.input_difficulty.value = val;
                                    }} />
                            </div>
                        </div>
                        <div className="col-xs-3" style={{paddingTop:'12px'}}></div>
                        <div className="col-xs-9">
                            <RaisedButton
                                label="Update"
                                secondary={true}
                                onClick={()=>{
                                    updateOneAssignmentCategory(currentLeaf.id, {
                                        primary_owner: +this.refs.input_owner1.value,
                                        secondary_owner: +this.refs.input_owner2.value,
                                        difficulty: +this.refs.input_difficulty.value
                                    });
                                }} />
                            <div style={{opacity:updateMsgOpacity, 'transition': 'opacity 2s'}}>
                                {'Update successfully'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

FeatureAnalysisTreePage.propTypes = {
    dataSource                 : PropTypes.array.isRequired,
    treeDataSource             : PropTypes.object.isRequired,
    currentLeaf                : PropTypes.object.isRequired,
    categoryWaitToUpdate       : PropTypes.object,
    updateMsgOpacity           : PropTypes.number.isRequired,
    aryOwners                  : PropTypes.array.isRequired,
    aryDifficulties            : PropTypes.array.isRequired,
    updateOneAssignmentCategory: PropTypes.func.isRequired,
    fetchAssignmentCategories  : PropTypes.func.isRequired,
    setCurrentLeafNode         : PropTypes.func.isRequired,
    setFormVisibility          : PropTypes.func.isRequired,
    fetchOwners                : PropTypes.func.isRequired,
    fetchDifficulties          : PropTypes.func.isRequired,
    changeCategoryWaitForUpdate: PropTypes.func.isRequired,
    fetchAnalysisPageData      : PropTypes.func.isRequired,
    fetchAssignmentCategories  : PropTypes.func.isRequired
};
FeatureAnalysisTreePage.defaultProps = {
    currentLeaf                : {},
    aryOwners                  : [],
    aryDifficulties            : [],
    updateMsgOpacity           : 0,
    categoryWaitToUpdate       : {},
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
)(FeatureAnalysisTreePage);
