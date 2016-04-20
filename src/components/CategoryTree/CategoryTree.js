// Libraries
import React, { Component, PropTypes } from 'react';
// Components
import TreeView from 'react-treeview';
import NodeLabel from './Node-Label';
// Styles
import '../../../node_modules/react-treeview/react-treeview.css';
import './Category-Tree.css';

class CategoryTree extends Component {
    _renderTree(data, index) {
        const { onLeafClick, onNodeClick, selectedPath } = this.props;
        let label,
            childTrees,
            possiblePaths = selectedPath.split('/').map((str, i, a) => {
                return a.slice(0, i + 1).join('/');
            });
        if (!data.children || data.children.length === 0) {
            return (
                <NodeLabel
                    data={data}
                    key={index}
                    isLeaf
                    isSelected={possiblePaths.indexOf(data.path) >= 0}
                    onClickHandler={() => {
                        onLeafClick(data);
                    }} />
            );
        } else {
            childTrees = data.children.map((child, i) => {
                return this._renderTree(child, data.name + i);
            });
            label = (
                <NodeLabel
                    data={data}
                    key={index}
                    isSelected={possiblePaths.indexOf(data.path) >= 0}
                    onClickHandler={() => {
                        onNodeClick(data);
                    }} />
            );

            return (
                <TreeView
                    nodeLabel={label}
                    collapsed={data.isCollapsed}
                    onClick={() => {
                        onNodeClick(data);
                    }}
                    key={index}>
                    {childTrees}
                </TreeView>
            );
        }
    }
    render() {
        const { data } = this.props;
        let treeHTML = Object.keys(data).length > 0 ? ::this._renderTree(data, 'root0') : null;
        return (
            <div className="category-tree">
                {treeHTML}
            </div>
        );
    }
}

CategoryTree.propTypes = {
    data: PropTypes.object.isRequired,
    selectedPath: PropTypes.string,
    onNodeClick: PropTypes.func,
    onLeafClick: PropTypes.func
};

CategoryTree.defaultProps = {
    selectedPath: 'root',
    onNodeClick: () => {},
    onLeafClick: () => {}
};

export default CategoryTree;
