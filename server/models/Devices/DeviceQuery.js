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

				query = r.db('work_genius').table('devices').orderBy({index: 'address_vcs'}).coerceTo('array');
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
	let apiRequest = new AxapiRequest(req.body.ip);
	console.log(IMAGE_HOST);
	console.log(req.body.release);
	console.log(req.body.build);
  console.log(req.body.with_fpga);
	return res.json(await apiRequest.upgrade(IMAGE_HOST, req.body.release, req.body.build, req.body.with_fpga));
};


export const getReleases = async (req, res) => {
	// console.log(req);	
	let apiRequest = new AxapiRequest();
	console.log('before get releases');
	let releases = await apiRequest.getAllReleases();	
	console.log('after get releases');
	return res.json(releases);
};