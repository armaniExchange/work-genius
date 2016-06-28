// GraphQL
import {
	GraphQLString,
	GraphQLList
} from 'graphql';
// Types
import DeviceType from './DeviceType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';
import AxapiRequest from './AxapiRequest';

let DeviceQuery = {
	'allDevices': {
		type: new GraphQLList(DeviceType),
		description: 'Get all devices with pto data',
		resolve: async () => {
			let connection = null,
			    result = [],
			    query = null;
			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });

				query = r.db('work_genius').table('devices').coerceTo('array');
				result = await query.run(connection);
				await connection.close();
				return result;
			} catch (err) {
				return err;
			}
		}
	}
	
};

export default DeviceQuery;

export const getVersion = async (req, res) => {
	let apiRequest = AxapiRequest();
	apiRequest.setApiHost(req.query.ip);
	return apiRequest.getVersion();
	 // return res.json({
	 // 	release: '4_1_1',
	 // 	build: '838'
	 // });
};
export const upgrade = async (req, res) => {
	console.log(req);
	// let apiRequest = AxapiRequest();
	// apiRequest.setApiHost(ip);
	// return apiRequest.getVersion();

	 //    try {


	 //    } catch (err) {

	 //    }
	 return res.json({
	 	status: 'success'
	 });
};
export const getReleases = async (req, res) => {
	console.log(req);
	// let apiRequest = AxapiRequest();
	// apiRequest.setApiHost(ip);
	// return apiRequest.getVersion();

	 //    try {


	 //    } catch (err) {

	 //    }
	 return res.json([]);
};