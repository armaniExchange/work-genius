console.log(Date());
var glob = require("glob")
var config = require("./config");
var request=require('request');
var devices = require('./devices');


function send(requestOptions) {
	//return new Promise(function(resolve, reject) {});
	return new Promise(function(resolve, reject) {
		console.log(requestOptions);
		request(requestOptions, function(error, response, data) {
			if (!error && response.statusCode == 200) {
				resolve(data);
			} else {
				reject(new Error(error));
			}	
		});
	});
}

function getBasicOptions(host) {
	var options = {
	    headers: {"Connection":"close"},
	    url:'http://' + host.ip + '/axapi/v3/auth',
	    method: 'POST',
	    json:true,
	    body: {
		credentials:{username: host.user_name , password: host.password }
	    }
	};
	return options;
}

function authenticate(host) {
	var options = getBasicOptions(host);
	return send(options);
}

function getVersion(authData, host) {
	var options = getBasicOptions(host);
	//if (!error && response.statusCode == 200) {
	options.headers['Authorization'] = 'A10 ' + authData.authresponse.signature;
	options.url = 'http://' + host.ip + '/axapi/v3/version/oper';
	options.body = '';
	options.method = 'GET';
	return send(options);
}

function upgradeRequest(authData, versionData, matchedImagePath, host) {
	var options = getBasicOptions(host);
	//console.log('----info------',data);
	//data = JSON.parse(data);
	options.headers['Authorization'] = 'A10 ' + authData.authresponse.signature;
	options.url = 'http://' + host.ip + '/axapi/v3/upgrade/hd';

	var imageFrom = {
		'HD_PRIMARY': 'pri',
		'HD_SECONDARY': 'sec'
	};
	options.body = {
		"hd": {
			"image": imageFrom[versionData.version.oper['boot-from']],
			"use-mgmt-port": 1,
			"reboot-after-upgrade": 1,
			"file-url": "scp://"+ config.imageUser +":" + config.imagePassword + "@" + config.imageHost + ":" + matchedImagePath
		}
	};
	console.log("upgrade options", options);
	console.log('upgrading' + host.ip +  '...' );
	//console.log("Upgrade full URL ", options.body.hd["file-url"]);
	return send(options);
	return authData;
}

function getBuildNo(imagePath) {
    var outputs = "";
    var secs = imagePath.split('/');
    var build = secs[3];
    var releaseSecs = build.split('_');
    var releaseBuild = releaseSecs[6];

    return parseInt(releaseBuild);
}


function matchRelease(versionData) {
	var release, fpga, currentRelease, currentBuildNo;
	var options = {};
	var bootFrom = versionData.version.oper['boot-from'];
	if (bootFrom == 'HD_PRIMARY') {
		currentRelease = versionData.version.oper['hd-pri'];	
	} else {
		currentRelease = versionData.version.oper['hd-sec'];	
	}

        currentBuildNo = parseInt(currentRelease.replace(/\d+\./g, ''));
	
	release = currentRelease.replace(/\.(\d+)$/, '').replace(/\./g, '_');
	fpga = versionData.version.oper['firmware-version'] == '0.0.0' ? '20' : '52';	
	var promise = new Promise(function (resolve, reject)  { 
		glob("/mnt/bldimage/BLD_STO_REL_" + release + "*." + fpga +  ".64/output/*.upg", options, function (err, files) {
			if (!err) {
				var buildNo = 0;
				var lastImage, largeBuildNo = 0;
				files.map(function(v) {
					buildNo = getBuildNo(v);
					if (buildNo > largeBuildNo) {
						largeBuildNo = buildNo;
						lastImage = v;
					}
				});
				if (!lastImage) {
					reject('Wrong Image Path');
				} else {
					if ( currentBuildNo === largeBuildNo ) {
						reject(new Error('Need not upgrade, it is already at the newest build'));
					} else {
						resolve(lastImage);
					}
				}
			} else {
				reject(err);
			}
		});
	});
	return promise;
}

// options 是可选的
//var IMAGE_HOST = '192.168.105.93';
function doUpgrade(host)
{
	var authData,versionData, matchedImagePath;
	authenticate(host)
		.then(
			function(data) {
				authData = data;
				return getVersion(authData, host);
			}, 
			function(error) {
				console.log(error, host.ip);
			}
		)
		.then(
			function(data) {
				versionData = data;
				return matchRelease(versionData);
			}, 
			function(error) {
				console.log(error, host.ip);
			}
		)
		.then(
			function(matchedImagePath) {
				return upgradeRequest(authData, versionData, matchedImagePath, host);
			}, 
			function(error) {
				console.log(error, host.ip);
			}
		)
		;
				
}

devices.then(
	function(allDevices) {
		allDevices.map(function(device) {
			doUpgrade(device);		
		});
	},
	function(error) {
		console.log('Error : ', error);
	}
);
