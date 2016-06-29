console.log(Date());
var glob = require("glob")

// options 是可选的
var IMAGE_HOST = '192.168.105.93';
function doUpgrade(host, imagePath)
{
	var request=require('request');

	var options = {
	    headers: {"Connection": "close"},
	    url:'http://' + host.ip + '/axapi/v3/auth',
	    method: 'POST',
	    json:true,
	    body: {
		credentials:{username: host.user_name , password: host.password }
	    }
	};

	function callback(error, response, data) {
	    if (!error && response.statusCode == 200) {
		//console.log('----info------',data);
		//data = JSON.parse(data);
		options.headers['Authorization'] = 'A10 ' + data.authresponse.signature;
		options.url = 'http://' + host.ip + '/axapi/v3/upgrade/hd';
		
		options.body = {
		    "hd": {
			"image": "pri",
			"use-mgmt-port": 1,
			"reboot-after-upgrade": 1,
			"file-url": "scp://upgrade:upgrade@" + IMAGE_HOST + ":" + imagePath
		    }
		};
		//console.log("Upgrade Options ", options);
		var upgradeCallback = function(error, response, data) {
			if (!error && response.statusCode == 200) {
				console.log('upgrade successful', host.ip);
			} else {
				console.log('upgrade failed on Host:', host.ip, 'reason:',  data);
			}
		}
		console.log('upgrading' + host.ip +  '...' );
		request(options, upgradeCallback);
		console.log('finished upgrade');
	    } else {
		// upgrade
		console.log('upgrade failed, authenticate fail', host);
	    }
	}

	request(options, callback);
}

function upgrade(device) {
	var release=device.release.replace(/\./g, '_') ,withFpga;
	console.log('================ RELEASE =====================', release);
	var options = {}, fpga = withFpga ? '52' : 20;
	var promise = new Promise(function (resolve, reject)  { 
		glob("/mnt/bldimage/BLD_STO_REL_" + release + "*." + fpga +  ".64/output/*.upg", options, function (err, files) {
			if (!err) {
				resolve(files);
			} else {
				reject(err);
			}
		});
	});

	var lastImage = "";
	var largeBuildNo = 0;
	promise.then(
		function resolved(result) {
			console.log("=========", result, device, "===============");
			result.map(function(v) {
				var buildNo = getBuildNo(v);
				if (buildNo > largeBuildNo) {
					largeBuildNo = buildNo;
					lastImage = v;
				}
			});
		},
		function rejected(err) {console.log(err)}
	).then(
		function () {
			console.log('To be upgrade with image path', lastImage, "Build NO:", largeBuildNo);
			doUpgrade(device, lastImage);
		}
	);
	
}

function getBuildNo(imagePath) {
    var outputs = "";
    var secs = imagePath.split('/');
    var build = secs[3];
    var releaseSecs = build.split('_');
    var releaseBuild = releaseSecs[6];

    return parseInt(releaseBuild);
}

var devices = require('./devices');
//console.log(devices);
//devices = [{
//"ip":  "192.168.105.72" ,
//"password":  "a10" ,
//"release":  "4_1_1" ,
//"user_name":  "admin",
//"with_fpga": false
//}];
devices.then(
	function(allDevices) {
		allDevices.map(function(device) {
			upgrade(device);		
		});
	},
	function(error) {
		console.log('Error : ', error);
	}
);
console.log('upgaded hosts');
//console.log(getBuildNo('/mnt/bldimage/BLD_STO_REL_4_1_1_110_182773_20160628_113515_0000.20.64PGO/output/ACOS_non_FTA_4_1_1_110.64.upg'));
