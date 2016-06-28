import request from 'request';
import r from 'rethinkdb';
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

class AxapiRequest {
    options = {
        json:true,
        headers: {'Connection': 'close'}
    }

    host = '192.168.105.72'


    async getDeviceInfo(ip) 
    {
        let connection = null,
            result = [],
            query = null;
        try {
            connection = await r.connect({ host: DB_HOST, port: DB_PORT });

            query = r.db('work_genius').table('devices').fitler({ip:ip}).coerceTo('array');
            result = await query.run(connection);
            await connection.close();            
            return result;
        } catch (err) {
            return err;
        }
    }


    setApiHost(apiHost) {
        this.host = apiHost;
    }

    axapiPromise (options) {
        return new Promise((resolve, reject) => {
            request(options, function(err, response, result) {
                if (err) {
                    reject(new Error(err));
                }
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
        let deviceInfo = this.getDeviceInfo(this.host);
        let authOptions = Object.assign({}, this.options, {
            url: this.buildAXAPI('auth'),
            method: 'POST',
            body: {
                credentials:{username: deviceInfo['username'], password: deviceInfo['password']}
            }
        });

        let result =  await this.axapiPromise(authOptions);
        this.options.headers['Authorization'] = 'A10 ' + result.authresponse.signature;
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
        let authOptions = Object.assign({}, this.options, {
            url: this.buildAXAPI('version/oper'),
            method: 'GET',
        });

        let result =  await this.axapiPromise(authOptions);
        this.logOff();
        return result;
    }

    buildImagePath(imageHost, release, build, withFPGA=false) {
        // let fpgaBit = 20;
        // if (withFPGA) {
        //     fpgaBit =
        // }
        console.log(imageHost, release, build, withFPGA );
        let imageUrl = `scp://${imageHost.username}:${imageHost.password}@${imageHost.host}:`;
        return `${imageUrl}/mnt/bldimage/ax/BLD_STO_REL_4_1_1_106_182629_20160625_113516_0000.42.64/output/ACOS_FTA_V2_4_1_1_106.64.upg`;
    }

    parseRelease(stdout) {
        let data = JSON.parse(stdout);
        let outputs = {};
        data.map((v) => {
            let secs = v.split('/');
            let build = secs[4];
            // let imageName = secs[6];
            let releaseSecs = build.split('_');
            let releaseNo = [releaseSecs[3], releaseSecs[4], releaseSecs[5]].join('_');
            let releaseBuild = releaseSecs[6];
            let releaseDate = releaseSecs[8].replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
            if (!outputs[releaseNo]) {
                outputs[releaseNo] = {};
            }
            outputs[releaseNo][releaseBuild] =  [releaseDate, v]; 
                
        });
        return outputs;
    }

    async getImageList() {
        let rf=require('fs');
        let data=rf.readFileSync('/var/www/work-genius/upgrade_list.txt','utf-8');
        let outputs = this.parseRelease(data);
        return outputs;
    }

    async upgrade(imageHost, release, build, withFPGA=false) {
        let authOptions = Object.assign({}, this.options, {
            url: this.buildAXAPI('upgrade/hd'),
            method: 'POST',
            body: {
                'hd': {
                    'image': 'pri',
                    'use-mgmt-port': 1,
                    'reboot-after-upgrade': 1,
                    'file-url': this.buildImagePath(imageHost, release, build, withFPGA)
                }
            }
        });

        console.log('upgrading...');
        let result =  await this.axapiPromise(authOptions);
        console.log('upgraded', result);
        // this.logOff();
        return result;
    }

}

export default AxapiRequest;