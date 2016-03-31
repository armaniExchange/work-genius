// Libraries
import React from 'react';

function countTagsByDifficulty(data) {
    if (data.children.length === 0) {
        if (data.difficulty.title) {
            return {
                [data.difficulty.title]: 1
            };
        } else {
            return {
                'undefined': 1
            };
        }
    } else {
        return data.children
            .map((childNode) => countTagsByDifficulty(childNode))
            .reduce((acc, node) => {
                Object.keys(node).forEach((k) => {
                    acc[k] = acc[k] ? acc[k] + node[k] : 1;
                });
                return acc;
            }, {});
    }
}

export default function NodeLabel({ data, onClickHandler, isLeaf, key }) {
    const style = {
        display: isLeaf ? 'block' : 'inline-block',
        color: isLeaf ? 'green' : 'black'
    };
    let tagsHtml = null;

    if (isLeaf) {
        tagsHtml = (
            <span>{data.difficulty.title}</span>
        );
    } else {
        tagsHtml = data.children.map((childNode) => {
            return countTagsByDifficulty(childNode);
        }).reduce((acc, diff) => {
            Object.keys(diff).forEach((k) => {
                acc[k] = acc[k] ? acc[k] + diff[k] : 1;
            });
            return acc;
        }, {});
        tagsHtml = Object.keys(tagsHtml).map((diff, i) => {
            return (
                <span key={i} className="tree-node-badge">{tagsHtml[diff]}</span>
            );
        });
    }

    return (
        <div
            key={key}
            className="node"
            style={style}>
            <span
                className="tree-node-text"
                onClick={onClickHandler}>
                {data.name}
            </span>
            {tagsHtml}
        </div>
    );
}
