// Libraries
import React, { Component, PropTypes } from 'react';

class NodeLabel extends Component {
    render() {
        const { key, data, isLeaf, isSelected, onClickHandler } = this.props;
        let nodeClasses = 'category-tree-node' +
            (isLeaf ? '__leaf' : '') + (isSelected ? '--selected' : '');
        let countHtml = isLeaf ? null : (
            <span className="category-tree-node__count">
                {data.childrenCount}
            </span>
        );
        return (
            <span
                className={nodeClasses}
                key={key}
                onClick={onClickHandler}>
                {data.name}
                {countHtml}
            </span>
        );
    }
}

NodeLabel.propTypes = {
    data: PropTypes.object.isRequired,
    key: PropTypes.string,
    isLeaf: PropTypes.bool,
    isSelected:  PropTypes.bool,
    onClickHandler: PropTypes.func
};

NodeLabel.defaultProps = {
    key: '',
    isLeaf: false,
    isSelected: false,
    onClickHandler: () => {}
};

export default NodeLabel;
