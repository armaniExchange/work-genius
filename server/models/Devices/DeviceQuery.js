// GraphQL
import {
	GraphQLList
} from 'graphql';
// Types
import DeviceType from './DeviceType.js';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT, IMAGE_HOST } from '../../constants/configurations.js';
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
	let apiRequest = new AxapiRequest(req.query.ip);
	return res.json(await apiRequest.getVersion());
};

export const upgrade = async (req, res) => {
	let apiRequest = new AxapiRequest(req.query.ip);
	return res.json(await apiRequest.upgrade(IMAGE_HOST, req.decoded.release, req.decoded.build, req.decoded.with_fpga));
};


export const getReleases = async (req, res) => {
	// console.log(req);	
	let apiRequest = new AxapiRequest();
	console.log('before get releases');
	let releases = await apiRequest.getAllReleases();	
	console.log('after get releases');
	return res.json(releases);
};