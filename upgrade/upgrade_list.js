//var exec = require('child_process').exec; 
//var cmdStr = 'ssh zli@192.168.3.229 "/home/zli/upgrade_list.py"';
function parseRelease(stdout) {
    var data = JSON.parse(stdout);
    var outputs = {};
    for (var i in data) {
        var secs = data[i].split('/');
    	var build = secs[4];
    	var imageName = secs[6];
    	var releaseSecs = build.split('_');
    	var releaseNo = [releaseSecs[3], releaseSecs[4], releaseSecs[5]].join('_');
    	var releaseBuild = releaseSecs[6];
    	var releaseDate = releaseSecs[8].replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3");
    	if (!outputs[releaseNo]) outputs[releaseNo] = {};
	outputs[releaseNo][releaseBuild] =  [releaseDate, data[i]];
        
    }
    return outputs;
}

//exec(cmdStr, function(err,stdout,stderr){
//    if(err) {
//        console.log('get upgrade list error:'+stderr);
//    } else {
//	outputs = parseRelease(stdout);	
//	console.log(outputs);
//    }
//});

var rf=require("fs");  
var data=rf.readFileSync("/var/www/work-genius/upgrade_list.txt","utf-8");
var outputs = parseRelease(data);
console.log(outputs);

