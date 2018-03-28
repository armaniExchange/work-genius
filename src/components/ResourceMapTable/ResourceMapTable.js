
import React, { Component, PropTypes } from 'react';

// Constants
import Table from '../A10-UI/Table/Table';

import ResourceMapTableHeader from './ResourceMapTableHeader.js';
import ResourceMapTableBody from './ResourceMapTableBody.js';
import ResourceMapModalWorkLog from './ResourceMapModalWorkLog.js';

class ResourceMapTable extends Component {

    constructor() {
        super();
    }

    onScrollTable(e) {
        if (this.headTable) {
            this.headTable.scrollLeft = e.target.scrollLeft;
        }
    }

	render() {

		const {
			startDate,
			totalDays,
			data,
			show,
			titles,
            tags,
            releases,
			onModalHander,
            onSubmitStatus,
            onSubmitMulti,
            onDeleteItemHander,
            upsertWorklogItem,
            defaultModalInfos,
            onAddTagHandler,
            onAddReleaseHandler
        } = this.props;
        let styles = {};
        if (totalDays === 7) {
		    return (
                <div style={styles}>
                    <Table className="bug-review-table">
                        <ResourceMapTableHeader
                            startDate={startDate}
                            totalDays={totalDays}
                        />
                        <ResourceMapTableBody
                            data={data}
                            startDate={startDate}
                            onModalHander={onModalHander}
                            onSubmitStatus={onSubmitStatus}
                            onDeleteItemHander={onDeleteItemHander}
                        />
                    </Table>
                    <ResourceMapModalWorkLog
                        show={show}
                        tags={tags}
                        titles={titles}
                        releases={releases}
                        onModalHander={onModalHander}
                        onModalSubmit={upsertWorklogItem}
                        onModalSubmitMulti={onSubmitMulti}
                        defaultModalInfos={defaultModalInfos}
                        onAddTagHandler={onAddTagHandler}
                        onAddReleaseHandler={onAddReleaseHandler}
                    />
                </div>
            );
        }
        return (
            <div style={{ width: '100%', maxHeight: '600px', overflow: 'hidden' }}>
                <div style={{ overflow: 'hidden' }} ref={(node) => this.headTable = node}>
                    <ResourceMapTableHeader
                        startDate={startDate}
                        totalDays={totalDays}
                    />
                </div>
                <div style={{overflow: 'scroll', maxHeight: '540px' }} onScroll={::this.onScrollTable}>
                    <Table className="bug-review-table month-table">
                        <ResourceMapTableBody
                            data={data}
                            startDate={startDate}
                            onModalHander={onModalHander}
                            onSubmitStatus={onSubmitStatus}
                            onDeleteItemHander={onDeleteItemHander}
                        />
                    </Table>
                </div>
                <ResourceMapModalWorkLog
                    show={show}
                    tags={tags}
                    titles={titles}
                    releases={releases}
                    onModalHander={onModalHander}
                    onModalSubmit={upsertWorklogItem}
                    onModalSubmitMulti={onSubmitMulti}
                    defaultModalInfos={defaultModalInfos}
                    onAddTagHandler={onAddTagHandler}
                    onAddReleaseHandler={onAddReleaseHandler}
                />
            </div>
        );
	};
}

ResourceMapTable.propTypes = {
    startDate          : PropTypes.string.isRequired,
    totalDays          : PropTypes.number.isRequired,
    show               : PropTypes.bool.isRequired,
    data               : PropTypes.array.isRequired,
    tags               : PropTypes.array.isRequired,
    titles             : PropTypes.array.isRequired,
    releases           : PropTypes.array.isRequired,
    defaultModalInfos  : PropTypes.object.isRequired,
    upsertWorklogItem  : PropTypes.func.isRequired,
    onModalHander      : PropTypes.func.isRequired,
    onSubmitStatus     : PropTypes.func.isRequired,
    onSubmitMulti      : PropTypes.func.isRequired,
    onDeleteItemHander : PropTypes.func.isRequired,
    onAddTagHandler    : PropTypes.func.isRequired,
    onAddReleaseHandler: PropTypes.func.isRequired
};

ResourceMapTable.defaultProps = {
	startDate          : new Date(),
	totalDays          : 7,
	show               : false,
	data               : [],
    defaultModalInfos  : {}
};

export default ResourceMapTable;
