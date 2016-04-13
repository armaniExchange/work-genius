// GraphQL
import {
	GraphQLString,
	GraphQLInt
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import { APPROVED, CANCEL_REQUEST_APPROVED, CANCEL_REQUEST_PENDING } from '../../../src/constants/pto-constants';

let TaskMutation = {
	'createPTOApplication': {
		type: GraphQLString,
		description: 'Create a new pto application',
		args: {
			data: {
				type: GraphQLString,
				description: 'new pto application data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto').insert(JSON.parse(data));
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Create successfully!';
		}
	},
	'deletePTOApplication': {
		type: GraphQLString,
		description: 'Delete a pto application',
		args: {
			id: {
				type: GraphQLString,
				description: 'pto application id to be deleted'
			}
		},
		resolve: async (root, { id }) => {
			let connection = null,
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto').get(id).delete();
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Delete successfully!';
		}
	},
	'updatePTOApplicationStatus': {
		type: GraphQLString,
		description: 'Update a pto application',
		args: {
			id: {
				type: GraphQLString,
				description: 'pto application id to be updated'
			},
			status: {
				type: GraphQLString,
				description: 'new pto application status'
			},
			hours: {
				type: GraphQLInt,
				description: 'hours to apply in overtime application'
			}
		},
		resolve: async (root, { id, status, hours }) => {
			let connection = null,
				mutationQuery = null,
				result, userId;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto').get(id).update({
					status: status,
					isCompensable: r.row('isCompensable').default(false).or(status === CANCEL_REQUEST_PENDING && r.row('status').eq(APPROVED))
				}, {
					returnChanges: true
				});
				result = await mutationQuery.run(connection);
				if (status === APPROVED) {
					userId = result.changes[0].new_val.applicant_id;
					mutationQuery = r.db('work_genius').table('overtime_summary').get(userId);
					result = await mutationQuery.run(connection);
					if (!result) {
						mutationQuery = r.db('work_genius').table('overtime_summary').insert({
							id: userId,
							hours: 0
						});
					} else {
						let leftoverHours = result.hours - hours;
						if (leftoverHours >= 0) {
							mutationQuery = r.db('work_genius').table('overtime_summary').get(userId).update({
								hours: leftoverHours
							});
						} else {
							mutationQuery = r.db('work_genius').table('pto').get(id).update({
								hoursToDeduct: -leftoverHours
							});
							await mutationQuery.run(connection);
							mutationQuery = r.db('work_genius').table('overtime_summary').get(userId).update({
								hours: 0
							});
						}
					}
					await mutationQuery.run(connection);
				} else if (status === CANCEL_REQUEST_APPROVED && result.changes[0].new_val.isCompensable) {
					let hoursToDeduct = result.changes[0].new_val.hoursToDeduct || 0;
					userId = result.changes[0].new_val.applicant_id;
					mutationQuery = r.db('work_genius').table('overtime_summary').get(userId).update({
					    hours: r.row('hours').add(hours).sub(hoursToDeduct).default(0)
					});
					await mutationQuery.run(connection);
				}
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Update successfully!';
		}
	},
	'createOvertimeApplication': {
		type: GraphQLString,
		description: 'Create a new overtime application',
		args: {
			data: {
				type: GraphQLString,
				description: 'new overtime application data'
			}
		},
		resolve: async (root, { data }) => {
			let connection = null,
				mutationQuery = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('overtime').insert(JSON.parse(data));
				await mutationQuery.run(connection);
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Create successfully!';
		}
	},
	'updateOvertimeApplicationStatus': {
		type: GraphQLString,
		description: 'Update a overtime application',
		args: {
			id: {
				type: GraphQLString,
				description: 'overtime application id to be updated'
			},
			status: {
				type: GraphQLString,
				description: 'new overtime application status'
			},
			hours: {
				type: GraphQLInt,
				description: 'hours to apply in overtime application'
			}
		},
		resolve: async (root, { id, status, hours }) => {
			let connection = null,
				mutationQuery = null,
				result, userId;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('overtime').get(id).update({
					status: status
				}, {
					returnChanges: true
				});
				result = await mutationQuery.run(connection);

				if (status === APPROVED) {
					userId = result.changes[0].new_val.applicant_id;
					mutationQuery = r.db('work_genius').table('overtime_summary').get(userId);
					result = await mutationQuery.run(connection);
					if (!result) {
						mutationQuery = r.db('work_genius').table('overtime_summary').insert({
							id: userId,
							hours
						});
					} else {
						mutationQuery = r.db('work_genius').table('overtime_summary').get(userId).update({
							hours: result.hours + hours
						});
					}
					await mutationQuery.run(connection);
				}
				await connection.close();
			} catch (err) {
				return err;
			}

			return 'Update successfully!';
		}
	}
};

export default TaskMutation;
