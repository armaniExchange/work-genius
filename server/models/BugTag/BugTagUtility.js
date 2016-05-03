// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

export async function createTag(data, type){
	let connection = null,
		query = null,
		result = null;
		type = type || '';
	try {
		let tag = JSON.parse(data);
		if(tag.tag_name == ''){
			return 'Fail to create a '+ typ +' tag!';
		}
		tag.type = type;
		query = r.db('work_genius').table('bugtags').filter({tag_name:tag.tag_name,type:type}).coerceTo('array');
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		result = await query.run(connection);
		if(result && result.length > 0){
			return 'Fail to create a ' + type +' tag!';
		}
		query = r.db('work_genius').table('bugtags').insert(tag);
		await query.run(connection);
		await connection.close();
	} catch (err) {
		console.log(err);
		return 'Fail to create a ' + type+' tag!';
	}
	return 'Create '+ type +' tag successfully!';

}

export async function getTagList(name,type){
	let connection = null,
	    result = null,
	    func = tag => {
	    	if(!!name){
	    		return tag('tag_name').match(name);
	    	}
	    	return true;
	    },
		query = null;

	try {
		query = r.db('work_genius').table('bugtags').filter(func).filter({type:type}).coerceTo('array');
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		result = await query.run(connection);             
		await connection.close();
	} catch (err) {
		return err;
	}
	return result;
}