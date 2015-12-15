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
			pri: $('td:nth-child(9)', row).text(),
			severity: $('td:nth-child(10)', row).text(),
			status: $('td:nth-child(11)', row).text(),
			developer_email: $('td:nth-child(13)', row).text(),
			qa_email: $('td:nth-child(14) > span:first-child', row).text(),
			must_fix: true,
			project: $('a#summary-tab').text()
		};
	});

	return result;
}

export async function updateBugsToDB(bugs) {
	let connection, query, result = null;
	let newBugIdMap = {};
	let solvedBugs = [];

	try {
		connection = await r.connect({ host: DB_HOST, port: DB_PORT });
		// Delete solved bugs
		bugs.forEach((bug) => {
			newBugIdMap[bug.id] = true;
		});
		query = r.db('work_genius').table('tasks').filter({type: 'bug'}).coerceTo('array');
		result = await query.run(connection);
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
			query = r.db('work_genius').table('tasks').get(bugs[i]['id']);
			result = await query.run(connection);

			if (result) {
				query = r.db('work_genius').table('tasks').get(bugs[i]['id']).update(bugs[i]);
			} else {
				bugs[i].type = 'bug';
				bugs[i].eta = '';
				query = r.db('work_genius').table('tasks').insert(bugs[i]);
			}
			await query.run(connection);
		}
		await connection.close();
	} catch (err) {
		return err;
	}
}