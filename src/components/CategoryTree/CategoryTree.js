// Libraries
import React, { Component, PropTypes } from 'react';

class CategoryTree extends Component {
    render() {
        console.log(this.props.data);
        return (
            <div>Tree</div>
        );
    }
}

CategoryTree.propTypes = {
    data: PropTypes.object.isRequired,
    onNodeClick: PropTypes.func,
    onLeafClick: PropTypes.func
};

CategoryTree.defaultProps = {
    onNodeClick: () => {},
    onLeafClick: () => {}
};

export default CategoryTree;
