var request = require('request');
var r = require('rethinkdb');
var configs = require("./config");

function getDeviceInfo() 
{
	var promise = new Promise(function(resolve, reject) {
		var
		    result = [],
		    query = null;
		try {
			r.connect({ host: configs.DB_HOST, port: configs.DB_PORT }, function(err, connection) {
			    	if (!err) {
					query = r.db('work_genius').table('devices').filter({address:configs.location}).filter(r.row("locked_by").eq("").or(r.row("locked_by").eq("N/A"))).filter(r.row("vcs_configured").eq("Master").or(r.row("vcs_configured").eq("No"))).pluck("ip", "release","user_name","password","with-fpga","vcs_configured", "locked_by").coerceTo("array").run(connection, function(err, result) {
						if (!err) {
							resolve(result);
						} else {
							reject(new Error(err));		
						}
						connection.close();            	
					});
				} else {
					reject(new Error(err));
				}
			});
		} catch (err) {
			return err;
		}
	});
	return promise;
}

module.exports = getDeviceInfo();

// test purpose
getDeviceInfo().then(
function(result){
	console.log(result);
},
function(error) {
	console.log(error);
}
);
