// Libraries
import React, { Component, PropTypes } from 'react';
// Components
import TreeView from 'react-treeview';
import NodeLabel from './NodeLabel';
// Styles
import '../../../node_modules/react-treeview/react-treeview.css';
import './_AssignmentCategoryTree.css';

class AssignmentCategoryTree extends Component {
    _renderTree(data, index) {
        const { onLeafClick, onNodeClick } = this.props;
        let label, childTrees;

        if (!data.children || data.children.length === 0) {
            return (
                <NodeLabel
                    data={data}
                    onClickHandler={() => {
                        onLeafClick(data);
                    }}
                    key={index}
                    isLeaf />
            );
        } else {
            childTrees = data.children.map((child, i) => {
                return this._renderTree(child, data.name + i);
            });
            label = (
                <NodeLabel
                    data={data}
                    onClickHandler={() => {
                        onNodeClick(data);
                    }} />
            );
            return (
                <TreeView
                    nodeLabel={label}
                    defaultCollapsed={false}
                    key={index}>
                    {childTrees}
                </TreeView>
            );
        }
    }
    render() {
        const dataSource = this.props.data;
        let treeHTML = Object.keys(dataSource).length > 0 ? ::this._renderTree(dataSource, 0) : null;
        return (
          <div className="assignment-category-tree">
              {treeHTML}
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
