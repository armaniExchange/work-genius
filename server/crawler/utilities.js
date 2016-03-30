import { fromJS } from 'immutable';
import cheerio from 'cheerio';
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../constants/configurations.js';

export function parseHeaderCookie(headers, cookieMap) {
	let immutableMap = fromJS(cookieMap);
	headers['set-cookie'].forEach((cookie) => {
        let keyVal = cookie.split(';')[0].split('='),
            key = keyVal[0],
            val = keyVal[1];
        if (immutableMap.has(key)) {
            immutableMap = immutableMap.set(key, val);
        }
    });
	return immutableMap.toJS();
};

export function extractMustFixBugData(source) {
	var result = [];
	let $ = cheerio.load(source);
	$('tr.pbCheckRow.must-fix').each((i, row) => {
		result[i] = {
			id: $('td:nth-child(2) > a', row).text(),
			title: $('td:nth-child(3) > span', row).text().trim(),
			eta: $('td:nth-child(5) > a', row).text().trim(),
			created: $('td:nth-child(6)', row).text().trim(),
			pri: $('td:nth-child(11)', row).text(),
			severity: $('td:nth-child(12)', row).text(),
			status: $('td:nth-child(13)', row).text(),
			developer_email: $('td:nth-child(15)', row).text(),
			qa_email: $('td:nth-child(16) > span:first-child', row).text(),
			must_fix: true,
			project: $('a#summary-tab').text(),
			type: 'bug'
		};
	});

	return result;
}

export async function updateBugsToDB(bugs) {
	let connection, query, result = null;
	let newBugIdMap = {};
	let solvedBugs = [];
	let users = [];

	try {
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		// Delete solved bugs
		bugs.forEach((bug) => {
			newBugIdMap[bug.id] = true;
		});
		query = r.db('work_genius').table('tasks').filter({type: 'bug'}).coerceTo('array');
		result = await query.run(connection);
		query = r.db('work_genius').table('users').filter({}).coerceTo('array');
		users = await query.run(connection);
		for (let j = 0; j < result.length; j++) {
			if (!(result[j].id in newBugIdMap)) {
				solvedBugs.push(result[j].id);
			}
		}
		for (let k = 0; k < solvedBugs.length; k++) {
			query = r.db('work_genius').table('tasks').get(solvedBugs[k]).delete();
			await query.run(connection);
		}
		// Insert and Update new bugs
		for (let i = 0; i < bugs.length; i++) {
			users.forEach((user) => {
				if (user.email === bugs[i]['developer_email']) {
					bugs[i]['dev_id'] = user.id;
				}
			});
			query = r.db('work_genius').table('tasks').get(bugs[i]['id']);
			result = await query.run(connection);

			if (result) {
				query = r.db('work_genius').table('tasks').get(bugs[i]['id']).update(bugs[i]);
			} else {
				query = r.db('work_genius').table('tasks').insert(bugs[i]);
			}
			await query.run(connection);
		}
		await connection.close();
	} catch (err) {
		return err;
	}
}

export function extractFeatureData(source) {
	var result = [];
	let $ = cheerio.load(source);
	$('tr[data-id^=task-][data-id$=-row]').each((i, row) => {
		result[i] = {
			id: $('td:nth-child(1)', row).text(),
			title: $('td:nth-child(2) a:nth-child(2) span', row).text().trim(),
			eta: '---',
			status: $('td:nth-child(6) span', row).text(),
			total_percent: $('td:nth-child(7)', row).text().trim(),
			dev_percent: $('td:nth-child(8)', row).text().trim(),
			qa_percent: $('td:nth-child(9)', row).text().trim(),
			days_to_complete: $('td:nth-child(11)', row).text(),
			completed_date: $('td:nth-child(12) span', row).text(),
			owner_name: $('td:nth-child(13) span', row).text(),
			dev_name: $('td:nth-child(14) span', row).text(),
			qa_name: $('td:nth-child(15) span', row).text(),
			project: $('a#summary-tab').text(),
			type: 'feature'
		};
	});
	return result;
}

export async function updateFeaturesToDB(features) {
	let connection, query, result = null;
	let newFeatureIdMap = {};
	let completedFeatures = [];
	let users = [];

	try {
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		// Delete solved features
		features.forEach((feature) => {
			newFeatureIdMap[feature.id] = true;
		});
		query = r.db('work_genius').table('tasks').filter({type: 'feature'}).coerceTo('array');
		result = await query.run(connection);
		query = r.db('work_genius').table('users').filter({}).coerceTo('array');
		users = await query.run(connection);
		for (let j = 0; j < result.length; j++) {
			if (!(result[j].id in newFeatureIdMap)) {
				completedFeatures.push(result[j].id);
			}
		}
		for (let k = 0; k < completedFeatures.length; k++) {
			query = r.db('work_genius').table('tasks').get(completedFeatures[k]).delete();
			await query.run(connection);
		}
		// Insert and Update new features
		for (let i = 0; i < features.length; i++) {
			users.forEach((user) => {
				if (user.nickname === features[i]['dev_name']) {
					features[i]['dev_id'] = user.id;
				}
			});
			query = r.db('work_genius').table('tasks').get(features[i]['id']);
			result = await query.run(connection);

			if (result) {
				query = r.db('work_genius').table('tasks').get(features[i]['id']).update(features[i]);
			} else {
				query = r.db('work_genius').table('tasks').insert(features[i]);
			}
			await query.run(connection);
		}
		await connection.close();
	} catch (err) {
		return err;
	}
}
