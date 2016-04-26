// GraphQL
import {
	GraphQLString,
	GraphQLFloat
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import { APPROVED, CANCEL_REQUEST_APPROVED, CANCEL_REQUEST_PENDING } from '../../../src/constants/pto-constants';
import {recalcWorklogEndDate} from '../WorkLog/WorkLogCalc.js';
import {createPTO,updatePTOStatus} from './PTOUtility.js';

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
			return await createPTO(data);
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
				type: GraphQLFloat,
				description: 'hours to apply in overtime application'
			}
		},
		resolve: async (root, { id, status, hours }) => {
			return await updatePTOStatus(id,status,hours);
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
				mutationQuery = null,
				finalData = JSON.parse(data),
				applicant_email;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('users').filter(r.row('name').eq(finalData.applicant)).getField('email').coerceTo('array');
				applicant_email = await mutationQuery.run(connection);
				mutationQuery = r.db('work_genius').table('overtime').insert({...finalData, applicant_email: applicant_email[0]});
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
				type: GraphQLFloat,
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
	},
	'createPTOAndRefreshWorklog': {
		type: GraphQLString,
		description: 'Create a new pto application and recalc the end date of applicant worklog',
		args: {
			data: {
				type: GraphQLString,
				description: 'new pto application data'
			}
		},
		resolve: async (root, { data }) => {
			let result = await createPTO(data);
			if(typeof(result) === 'string' && result.includes('successfully')){
				//recalc the worklog end date of this user.
				try{
					let finalData = JSON.parse(data);
					await recalcWorklogEndDate(finalData.start_date,finalData.applicant_id);
				}
				catch(err){
					console.log(err);
				}
			}
			return result;
		}
	},
	'updatePTOStatusAndRefreshWorklog': {
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
				type: GraphQLFloat,
				description: 'hours to apply in overtime application'
			}
		},
		resolve: async (root, { id, status, hours }) => {
			let connection = null,
				mutationQuery = null,
				result;
			try{
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				mutationQuery = r.db('work_genius').table('pto')
					.get(id)
					.pluck('start_date','applicant_id');
				let {start_date,applicant_id} = await mutationQuery.run(connection);
				result = await updatePTOStatus(id,status,hours); 
				//recalc the worklog end date of this user.
				await recalcWorklogEndDate(start_date,applicant_id); 
				await connection.close();
			}
			catch(err){
				await connection.close();
				console.log(err);
			}
			return result;
		}
	}
};

export default TaskMutation;
