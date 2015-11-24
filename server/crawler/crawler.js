import request from 'request';
import {
    parseHeaderCookie,
    extractMustFixBugData,
    updateBugsToDB
} from './utilities.js';
import {
    GK2_LOG_IN_ACCOUNT,
    GK2_LOG_IN_PASSWORD,
    GK2_LOG_IN_URL,
    GK2_REFERER_URL,
    GK2_BJ_4_1_MUST_FIX_BUG_URL,
    GK2_SJ_4_1_MUST_FIX_BUG_URL,
    GK2_BJ_3_2_MUST_FIX_BUG_URL,
    GK2_SJ_3_2_MUST_FIX_BUG_URL,
    GK2_BJ_4_0_3_MUST_FIX_BUG_URL,
    GK2_SJ_4_0_3_MUST_FIX_BUG_URL
} from '../constants/configurations.js';

export function crawlerPromise(url = '', method = 'GET', formData = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        request({
            url               : url,
            method            : method,
            headers           : headers,
            formData          : formData,
            rejectUnauthorized: false,
            jar               : true
        }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    res : res,
                    body: body
                });
            }
        });
    });
};

export async function crawlGK2() {
    let cookieKeyValMap = {
            'csrftoken': null,
            'sessionid': null
        },
        formData = {
            csrfmiddlewaretoken: null,
            username: GK2_LOG_IN_ACCOUNT,
            password: GK2_LOG_IN_PASSWORD,
            'this_is_the_login_form': 1
        },
        headers = {
            'Referer': GK2_REFERER_URL
        },
        targetedBugURLs = [
            GK2_BJ_4_1_MUST_FIX_BUG_URL,
            GK2_SJ_4_1_MUST_FIX_BUG_URL,
            GK2_BJ_3_2_MUST_FIX_BUG_URL,
            GK2_SJ_3_2_MUST_FIX_BUG_URL,
            GK2_BJ_4_0_3_MUST_FIX_BUG_URL,
            GK2_SJ_4_0_3_MUST_FIX_BUG_URL
        ],
        bugs = [];

    try {
        let startTime = new Date();
        console.log('Crawling GK2...');
        // Get CSFR Token
        let { res: getRes } = await crawlerPromise(GK2_LOG_IN_URL,'GET');
        cookieKeyValMap = parseHeaderCookie(getRes.headers, cookieKeyValMap);
        // Log In
        formData.csrfmiddlewaretoken = cookieKeyValMap.csrftoken;
        let {
            res: postRes
        } = await crawlerPromise(GK2_LOG_IN_URL, 'POST', formData, headers);
        cookieKeyValMap = parseHeaderCookie(postRes.headers, cookieKeyValMap);
        // Get Targeted Bug URLs data
        for (let bugURL of targetedBugURLs) {
            let bugHeaderURL = bugURL.replace('/bugs', '/#/bugs');
            let {
                body: bugHeaderHTML
            } = await crawlerPromise(bugHeaderURL,'GET');
            let {
                body: targetHTML
            } = await crawlerPromise(bugURL,'GET');
            bugs = bugs.concat(extractMustFixBugData(bugHeaderHTML + targetHTML));
        }
        console.log(`Crawling complete! This crawling process took ${new Date() - startTime} ms`);
        // Write new bug data to db
        startTime = new Date();
        console.log('About to write crawling data into db...');
        updateBugsToDB(bugs);
        console.log(`write to DB complete! This writing process took ${new Date() - startTime} ms`);
    } catch (e) {
        console.log(e);
    }
};
