// Libraries
import React from 'react';

function countTagsByDifficulty(data) {
    if (data.children.length === 0) {
        if (data.difficulty && data.difficulty.title) {
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
                    acc[k] = acc[k] ? acc[k] + node[k] : node[k];
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
    let tagsHtml = null,
        total;

    if (!isLeaf) {
        tagsHtml = data.children.map((childNode) => {
            return countTagsByDifficulty(childNode);
        }).reduce((acc, diff) => {
            Object.keys(diff).forEach((k) => {
                acc[k] = acc[k] ? acc[k] + diff[k] : diff[k];
            });
            return acc;
        }, {});
        total = Object.keys(tagsHtml).reduce((acc, x) => {
            return acc + tagsHtml[x];
        }, 0);
        tagsHtml = [(
            <span
                key={total}
                className="tree-node-badge tree-node-badge--total">
                {total}
            </span>
        )].concat(Object.keys(tagsHtml).map((diff, i) => {
            let classes = `tree-node-badge tree-node-badge--${diff.replace(' ', '-')}`;
            return (
                <span
                    key={i}
                    title={diff}
                    className={classes}>
                    {tagsHtml[diff]}
                </span>
            );
        }));
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
