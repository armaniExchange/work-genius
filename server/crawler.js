import request from 'request';
import cheerio from 'cheerio';

export function crawlerPromise(url = '', method = 'GET', formData = {}) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: method,
            formData: formData
        }, (err, res, body) => {
            if (err || !body) {
                reject(new Error('No content!!'));
            } else {
                resolve(body);
            }
        });
    });
};

export function extractYahooNewsHeader(source) {
    let $ = cheerio.load(source);
    let newsHeaders = [];

    $('div h3 a').each((index, elem) => {
        newsHeaders.push(elem.children[0].data);
    });

    return newsHeaders;
};
