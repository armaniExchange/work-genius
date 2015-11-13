import request from 'request';
import { parseHeaderCookie, extractMustFixBugData } from './utilities.js';
import {
    GK2_LOG_IN_ACCOUNT,
    GK2_LOG_IN_PASSWORD,
    GK2_LOG_IN_URL,
    GK2_REFERER_URL,
    GK2_BEIJING_MUST_FIX_BUG_URL
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
        bugs = [];

    try {
        // Get CSFR Token
        let { res: getRes } = await crawlerPromise(GK2_LOG_IN_URL,'GET');
        cookieKeyValMap = parseHeaderCookie(getRes.headers, cookieKeyValMap);
        // Log In
        formData.csrfmiddlewaretoken = cookieKeyValMap.csrftoken;
        let {
            res: postRes
        } = await crawlerPromise(GK2_LOG_IN_URL, 'POST', formData, headers);
        cookieKeyValMap = parseHeaderCookie(postRes.headers, cookieKeyValMap);
        // Get beijing team must-fix bug data
        let {
            body: mustFixHtml
        } = await crawlerPromise(GK2_BEIJING_MUST_FIX_BUG_URL,'GET');
        bugs = bugs.concat(extractMustFixBugData(mustFixHtml));
        console.log(bugs);
    } catch (e) {
        console.log(e);
    }
};
