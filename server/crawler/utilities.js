import { fromJS } from 'immutable';
import cheerio from 'cheerio';

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
			bugNumber: $('td:nth-child(2) > a', row).text(),
			title: $('td:nth-child(3) > span', row).text().trim(),
			pri: $('td:nth-child(9)', row).text(),
			severity: $('td:nth-child(10)', row).text(),
			status: $('td:nth-child(11)', row).text(),
			developerEMail: $('td:nth-child(13)', row).text(),
			qaEMail: $('td:nth-child(14) > span:first-child', row).text(),
			mustFix: true
		};
	});

	return result;
}