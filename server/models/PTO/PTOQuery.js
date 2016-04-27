// GraphQL
import {
	GraphQLString,
	GraphQLList,
	GraphQLInt
} from 'graphql';
// Models
import PTOType from './PTOType.js';
// Library
import r from 'rethinkdb';
import moment from 'moment';
// Constants
import { DB_HOST, DB_PORT, ADMIN_ID } from '../../constants/configurations.js';

let TaskQuery = {
	'ptoApplications': {
		type: new GraphQLList(PTOType),
		description: 'Get all pto Applications',
		args: {
			applicantId: {
				type: GraphQLString,
				description: 'The applicant id for filtering applications'
			},
			timeRange: {
				type: GraphQLInt,
				description: 'The time range for filtering applications'
			}
		},
		resolve: async (root, { applicantId, timeRange }) => {
			let connection = null,
				filterCondition = (!applicantId || applicantId === ADMIN_ID) ? {} : {
					'applicant_id': applicantId
				},
			    result = null,
				query = r.db('work_genius').table('pto')
				    .filter(filterCondition).merge((pto) => ({
						applicant: r.db('work_genius').table('users').get(pto('applicant_id')).getField('name'),
						applicant_email: r.db('work_genius').table('users').get(pto('applicant_id')).getField('email')
					}))
				    .coerceTo('array');

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				result = result.filter((application) => {
					return +moment(+application.end_time).format('YYYY') === timeRange;
				});
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	},
	'overtimeApplications': {
		type: new GraphQLList(PTOType),
		description: 'Get all overtime applications',
		args: {
			applicantId: {
				type: GraphQLString,
				description: 'The applicant id for filtering applications'
			},
			timeRange: {
				type: GraphQLInt,
				description: 'The time range for filtering applications'
			}
		},
		resolve: async (root, { applicantId, timeRange }) => {
			let connection = null,
				filterCondition = (!applicantId || applicantId === ADMIN_ID) ? {} : {
					'applicant_id': applicantId
				},
			    result = null,
				query = r.db('work_genius').table('overtime')
				    .filter(filterCondition)
				    .coerceTo('array');

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				result = result.filter((application) => {
					return +moment(+application.start_time).format('YYYY') === timeRange;
				});
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default TaskQuery;
