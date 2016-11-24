var request = require('request');
var r = require('rethinkdb');
var mysql = require('mysql');
var configs = require("./config");


function getConnection(){
	var connection ;
	try{
		connection = mysql.createConnection({
		    host: configs.BUG_DB_HOST,
		    user: configs.BUG_DB_USER,
		    password: configs.BUG_DB_PWD,
		    database: configs.BUG_TABLE 
		});
		connection.connect();
		console.log('db connected;');
	} catch (err) {
		console.log(err);
	}
	return connection;
}

//get all bugs of this branch
function getBugs(release){
	var promise = new Promise(function(resolve, reject) {
		var conn = getConnection();
		if(conn){
			try{
				
				var sql = "SELECT \
					 bugs.bug_id AS id,profiles.login_name AS assigned_to,\
					 bugs.bug_severity,bugs.bug_status,'"+release.label+"' AS label,\
					 '[]' AS menu,'' AS resolved_type,'' AS review,\
					 '' AS tags,\
					 bugs.short_desc AS title,\
					 bugs.resolution\
					FROM\
					 bugs,\
					 profiles\
					WHERE\
					 bugs.release_id = "+release.id+"\
					AND bugs.assigned_to = profiles.userid\
					AND profiles.login_name IN (\
					 'yhou@a10networks.com',\
					 'yli@a10networks.com',\
					 'zgao@a10networks.com',\
					 'ruiz@a10networks.com',\
					 'lzhang@a10networks.com',\
					 'kjia@a10networks.com',\
					 'wna@a10networks.com',\
					 'stsai@a10networks.com',\
					 'vlai@a10networks.com',\
					 'shuang@a10networks.com',\
					 'ahuang@a10networks.com',\
					 'kfong@a10networks.com',\
					 'sho@a10networks.com',\
					 'howardc@a10networks.com',\
					 'chuang@a10networks.com',\
					 'shou@a10networks.com',\
					 'cmo@a10networks.com')";
				 conn.query(sql, function(err, rows, fields) {
				    if (err) throw err;
				    resolve(rows);
				})
			} catch(err){
				console.log(err);
				reject(err);
			}finally{
				conn.end();
			}
		}
		
	});
	return promise;
}

// insert the bug into rethinkDB
function syncToKB(release){
	getBugs(release).then(async function(result){
		if(!result ||  result.length == 0 ){
			return;
		}
		let connection = null,
			query = null,
			kbBug = null;
		try {
			connection = await r.connect({ host: configs.DB_HOST, port: configs.DB_PORT });
			for(let bug of result){
				bug.assigned_to = bug.assigned_to.replace('@a10networks.com','');
				query = r.db('work_genius')
			    		 .table('bugs_review')
			    		 .get(bug.id);
    		    kbBug = await query.run(connection);
    		    if(!kbBug){
    		    	query = r.db('work_genius')
			    		 .table('bugs_review')
			    		 .insert(bug);
					await query.run(connection);
    		    }
			}
			await connection.close();
			
		} catch (err) {
			console.log(err);
			await connection.close();
		}

	});
	
}

// the release info is queryed from bugs mysql DB
let release_list = [{
	'label': '4.1.0',
	'id': 2410
},{
	'label': '4.1.1',
	'id': 2707
},{
	'label': '4.1.1 p1',
	'id': 2986
}];

for(let release of release_list){
	syncToKB(release);
}
