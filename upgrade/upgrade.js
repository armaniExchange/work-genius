var request=require('request');

var options = {
    headers: {"Connection": "close"},
    url:'http://192.168.105.72/axapi/v3/auth',
    method: 'POST',
    json:true,
    body: {
	credentials:{username: "admin", password: "a10"}
    }
};

function callback(error, response, data) {
    if (!error && response.statusCode == 200) {
        //console.log('----info------',data);
	//data = JSON.parse(data);
	options.headers['Authorization'] = 'A10 ' + data.authresponse.signature;
	options.url = 'http://192.168.105.72/axapi/v3/upgrade/hd';
	
	options.body = {
	    "hd": {
		"image": "pri",
		"use-mgmt-port": 1,
		"reboot-after-upgrade": 1,
		"file-url": "scp://zli:Lzp_2016_4_11@192.168.3.229:/mnt/bldimage/ax/BLD_STO_REL_4_1_1_106_182629_20160625_113516_0000.42.64/output/ACOS_FTA_V2_4_1_1_106.64.upg"
	    }
	};
	var upgradeCallback = function(error, response, data) {
    		if (!error && response.statusCode == 200) {
			console.log('upgrade successful');
		} else {
			console.log('upgrade failed', data);
		}
	}
	console.log('upgrading...');
	request(options, upgradeCallback);
	console.log('upgraded');
    } else {
	// upgrade
        console.log('upgrade failed, authenticate fail');
    }
}

request(options, callback);
