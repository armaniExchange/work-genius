import request from 'request';
import {
    parseHeaderCookie,
    extractMustFixBugData,
    updateBugsToDB,
    extractFeatureData,
    updateFeaturesToDB
} from './utilities.js';
import {
    GK2_LOG_IN_ACCOUNT,
    GK2_LOG_IN_PASSWORD,
    GK2_LOG_IN_URL,
    GK2_REFERER_URL,
    GK2_MUST_FIX_BUG_URLS,
    GK2_FEATURE_URLS
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
    if (global.isCrawling) {
        console.log('Server is already crawling!');
        throw new Error('Server is already crawling!');
    }
    global.isCrawling = true;
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
        bugs = [],
        features = [];

    try {
        let startTime = new Date();
        console.log(`[${startTime.toString()}] Crawling GK2...`);
        // Get CSFR Token
        let { res: getRes } = await crawlerPromise(GK2_LOG_IN_URL,'GET');
        cookieKeyValMap = parseHeaderCookie(getRes.headers, cookieKeyValMap);
        // Log In
        formData.csrfmiddlewaretoken = cookieKeyValMap.csrftoken;
        let {
            res: postRes
        } = await crawlerPromise(GK2_LOG_IN_URL, 'POST', formData, headers);
        cookieKeyValMap = parseHeaderCookie(postRes.headers, cookieKeyValMap);
        // Get Must Fix Bug URLs data
        for (let bugURL of GK2_MUST_FIX_BUG_URLS) {
            let bugHeaderURL = bugURL.replace('/bugs', '/#/bugs');
            let {
                body: bugHeaderHTML
            } = await crawlerPromise(bugHeaderURL,'GET');
            let {
                body: targetHTML
            } = await crawlerPromise(bugURL,'GET');
            bugs = bugs.concat(extractMustFixBugData(bugHeaderHTML + targetHTML));
        }
        // Get Feature URLs data
        for (let featureURL of GK2_FEATURE_URLS) {
            let featureHeaderURL = featureURL.replace('features/list/', '#/features/');
            let {
                body: featureHeaderHTML
            } = await crawlerPromise(featureHeaderURL,'GET');
            let {
                body: targetHTML
            } = await crawlerPromise(featureURL,'GET');
            features = features.concat(extractFeatureData(featureHeaderHTML + targetHTML));
        }
        console.log(`Crawling complete! This crawling process took ${new Date() - startTime} ms`);
        // Write new bug data to db
        startTime = new Date();
        console.log('About to write crawling data into db...');
        await updateBugsToDB(bugs);
        await updateFeaturesToDB(features);
        global.isCrawling = false;
        console.log(`write to DB complete! This writing process took ${new Date() - startTime} ms`);
        console.log(`====================================================================`);
    } catch (e) {
        global.isCrawling = false;
        console.log(`Crawling failed due to ${e}`);
        console.log(`====================================================================`);
        throw e;
    }
};
