// Libraries
import React, { Component, PropTypes } from 'react';
// Components
import TreeView from 'react-treeview';
// Styles
import '../../../node_modules/react-treeview/react-treeview.css';

class AssignmentCategoryTree extends Component {
    _renderTree(data, index) {
        const { onLeafClick, onNodeClick } = this.props;
        let label = (
            <span className="node" onClick={() => {
                onNodeClick(data);
            }}>
                {data.name}
            </span>
        ),
        childTrees;

        if (!data.children || data.children.length === 0) {
            return (
                <div
                    key={index}
                    onClick={() => {
                        onLeafClick(data);
                    }}>
                    {data.name}
                </div>
            );
        } else {
            childTrees = data.children.map((child, i) => {
                return this._renderTree(child, data.name + i);
            });
            return (
                <TreeView
                    nodeLabel={label}
                    defaultCollapsed={true}
                    key={index}>
                    {childTrees}
                </TreeView>
            );
        }
    }
    render() {
        const dataSource = this.props.data;
        return (
          <div>
              {::this._renderTree(dataSource, 0)}
          </div>
        );
    }
}

AssignmentCategoryTree.propTypes = {
    data: PropTypes.object.isRequired,
    onNodeClick: PropTypes.func,
    onLeafClick: PropTypes.func
};
AssignmentCategoryTree.defaultProps = {
    onNodeClick: () => {},
    onLeafClick: () => {}
};

export default AssignmentCategoryTree;
