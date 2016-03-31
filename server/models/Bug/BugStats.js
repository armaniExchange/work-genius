// GraphQL
import {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';
// Models
import BUG_STATS_TYPE from './BugStatsType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugStats = {
	'getRootCauseSummary': {
		type: new GraphQLList(BUG_STATS_TYPE),
		description: 'Get root cause summary',
        args: {
			label: {
				type: GraphQLString,
				description: 'project'
			}
		},
		resolve: async (root, { label}) => {
			let connection = null,
			    result = [],
                filter = {},
				query = null;

			try {
				if(label){
					filter.label = label;
				}
				query = r.db('work_genius').table('bugs').filter(filter).group('resolved_type').count();
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				let rootCauseSummary = await query.run(connection); 
				let totalNumber = 0;
				rootCauseSummary.forEach((group) => {
					totalNumber += group.reduction;
				});
				for(let group of rootCauseSummary){
					let item = {
						name : '',
						number : 0,
						percentage : ''
					};
					item.name = group.group || '';
					item.number = group.reduction || 0;
					if(totalNumber){
						item.percentage = String((item.number/totalNumber * 100).toFixed(2)) + '%';
					}
					result.push(item);
				}
           
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default BugStats;