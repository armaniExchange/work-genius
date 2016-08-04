import request from 'request';
import r from 'rethinkdb';
import { DB_HOST, DB_PORT, PRODUCTION_MODE } from '../../constants/configurations.js';
import glob from 'glob';
export default class AxapiRequest {
    options = {
        json:true,
        headers: {'Connection': 'close', 'Authorization': ''}
    }

    host = '192.168.105.72'

    constructor(apiHost='192.168.105.72') {
        // console.log('setApiHost', apiHost);
        this.host = apiHost;
    }

    async getDeviceInfo(ip) 
    {
        let connection = null,
            result = [],
            query = null;
        try {
            connection = await r.connect({ host: DB_HOST, port: DB_PORT });

            query = r.db('work_genius').table('devices').filter({ip:ip}).coerceTo('array');
            result = await query.run(connection);
            await connection.close();
            return result;
        } catch (err) {
            return err;
        }
    }

    axapiPromise (options) {
        return new Promise((resolve, reject) => {
            request(options, function(err, response, result) {
                if (err) {
                    reject(new Error(err));
                }
                // console.log(response);
                if (!err && response.statusCode === 200) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }

            });
        });

    };

    buildAXAPI(path) {
        return 'http://' + this.host + '/axapi/v3/' + path;
    }

    async getAuthToken() {
        // let deviceInfo = this.getDeviceInfo(this.host);
        let deviceInfo = {username: 'admin', password: 'a10'};
        // console.log('=============== device info ==============', deviceInfo);
        let authOptions = Object.assign({}, this.options, {
            url: this.buildAXAPI('auth'),
            method: 'POST',
            body: {
                credentials:{username: deviceInfo['username'], password: deviceInfo['password']}
            }
        });

        let result =  await this.axapiPromise(authOptions);
        return 'A10 ' + result.authresponse.signature;
    }

    async logOff() {
        let authOptions = Object.assign({}, this.options, {
            url: this.buildAXAPI('logoff'),
            method: 'POST',
            body: {}
        });

        return await this.axapiPromise(authOptions);
    }

    async getVersion() {
        let token = await this.getAuthToken();
        this.options.headers['Authorization'] = token;
        let authOptions = Object.assign({}, this.options, {
            url: this.buildAXAPI('version/oper'),
            method: 'GET',
        });
        // console.log('get version auth options', authOptions);
        let result =  await this.axapiPromise(authOptions);
        // console.log('result is : ' , result);
        this.logOff();
        return result;
    }

    async getAliveReleases() {
        let glob = require('glob');
        let options = {};
        return new Promise((resolve, reject) => {
            glob('/mnt/bldimage/BLD_STO_REL_*/output/*.upg', options, function (err, files) {
                if (!err) {
                    resolve(files);
                } else {
                    reject(new Error(err));
                }
            });
        });

    }

    buildImagePath(imageHost, release, build, fpga) {
        let imageUrl = `scp://${imageHost.username}:${imageHost.password}@${imageHost.host}:`;
        // var fpga = '20';
        var pattern = "/mnt/bldimage/BLD_STO_REL*" + release + "_" + build + "*" + fpga + ".64/output/*.upg";
        var files = glob.sync(pattern, {});

        // files = [ '/mnt/bldimage/BLD_STO_REL_4_1_1_108_182691_20160626_211123_0000.20.64/output/ACOS_non_FTA_4_1_1_108.64.upg' ];
        if (files && files[0]) {
            return `${imageUrl}${files[0]}`;
        }
        // var file = '/mnt/bldimage/BLD_STO_REL_4_1_1_108_182691_20160626_211123_0000.20.64/output/ACOS_non_FTA_4_1_1_108.64.upg';
        // return `${imageUrl}${file}`;
        return undefined;
    }

    async getAllReleases() {
        var data = [];
        if (PRODUCTION_MODE) {
            data = await this.getAliveReleases();
        } else {
            let dataDemo = require('./release_demo_data');
            data = dataDemo.default;
            // console.log('data from lib', data.default);
        }

        // let data = JSON.parse(stdout);
        let outputs = {};
        // console.log(data, 'is data');
        data.map((v) => {
            let secs = v.split('/');
            let build = secs[3];
            // let imageName = secs[6];
            let releaseSecs = build.split('_');
            let releaseNo = [releaseSecs[3], releaseSecs[4], releaseSecs[5]].join('_');
            let releaseBuild = releaseSecs[6];
            let releaseDate = releaseSecs[8].replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
            if (!outputs[releaseNo]) {
                outputs[releaseNo] = {};
            }

            if (!outputs[releaseNo][releaseBuild]) {
                outputs[releaseNo][releaseBuild] = [];
            }
            outputs[releaseNo][releaseBuild].push([releaseDate, v]); 
        });
        return outputs;
    }

    // async getImageList() {
    //     let rf=require('fs');
    //     let data=rf.readFileSync('/var/www/work-genius/upgrade_list.txt','utf-8');
    //     let outputs = this.parseRelease(data);
    //     return outputs;
    // }

    async upgrade(imageHost, query) {
        console.log(query);
        let buildImagePath = this.buildImagePath(imageHost, query.release, query.build, query.fpga);
        if (!buildImagePath) {
            return {msg: {err: 'Cannot find image file.'}}
        }
        let token = await this.getAuthToken();
        this.options.headers['Authorization'] = token;
        // let buildImagePath = 'scp://upgrade:upgrade@192.168.105.93:/mnt/bldimage/BLD_STO_REL_4_1_1_115_183167_20160704_031553_0000.20.64/output/ACOS_non_FTA_4_1_1_115.64.upg';
        let authOptions = Object.assign({}, this.options, {
            url: this.buildAXAPI('upgrade/hd'),
            method: 'POST',
            body: {
                'hd': {
                    'image': query.image,
                    'use-mgmt-port': 1,
                    'reboot-after-upgrade': 1,
                    'file-url': buildImagePath
                }
            }
        });
        console.log(authOptions);
        // let result = {};
        let result =  await this.axapiPromise(authOptions);
        // this.logOff();
        return {
            msg: {
                result: result,
                option: authOptions
            }
        };
    }

};
