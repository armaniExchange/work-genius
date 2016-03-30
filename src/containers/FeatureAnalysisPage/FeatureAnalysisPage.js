import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components

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
    render() {
        return (
            <div className="row">
                <div className="pull-left col-md-6">Tree here</div>
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
                      }} />
                    </div>
                  </div>
                </div>
            </div>
        );
    }
}

FeatureAnalysisPage.propTypes = {
    curCategory: PropTypes.string,
    treeDataSource: PropTypes.array.isRequired,
    fetchAssignmentCategories: PropTypes.func.isRequired,
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
