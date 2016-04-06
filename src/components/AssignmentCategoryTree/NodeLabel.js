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

function orderByDifficulty(a, b) {
    const MAP = {
        'undefined': 0,
        'Nothing': 1,
        'Easy': 2,
        'Medium': 3,
        'Hard': 4,
        'Very Hard': 5
    };
    return MAP[b] - MAP[a];
}

export default function NodeLabel({ data, onClickHandler, isLeaf, key, owners, selected }) {
    const nodeClasses = `node ${isLeaf ? 'leaf' : ''} ${selected ? 'node--selected' : ''}`;
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
        )].concat(Object.keys(tagsHtml).sort(orderByDifficulty).map((diff, i) => {
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
    } else {
        tagsHtml = [data.primary_owner, data.secondary_owner].map((ownerId, i) =>{
            let iconHtml = i === 0 ?
                (<i className="material-icons">looks_one</i>) :
                (<i className="material-icons">looks_two</i>);
            if (ownerId) {
                return (
                    <span className="tree-node-icon" key={ownerId + i}>
                        {iconHtml}
                        {owners.filter(owner => +owner.id === +ownerId)[0].name}
                    </span>
                );
            }
            return null;
        });
    }

    return (
        <div
            key={key}
            className={nodeClasses}>
            <span
                className="tree-node-text"
                onClick={onClickHandler}>
                {data.name}
            </span>
            {tagsHtml}
        </div>
    );
}
