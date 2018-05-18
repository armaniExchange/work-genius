import r from 'rethinkdb';
import { DB_HOST, DB_PORT, MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD } from '../../constants/configurations.js';
import mysql from 'mysql';
import moment from 'moment';

async function getCheckPoint() {
  let checkpoints;
  try {
    const query = r.db('work_genius').table('bug_check_points').coerceTo('array');
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    checkpoints = await query.run(connection);
    await connection.close();
  } catch(e) {
    checkpoints = [];
  }

  const result = [];
  checkpoints.forEach(function(item) {
    const key = item.key;
    const value = item.value;

    var tmpRef = result;
    var keyArr = key.split('-');
    keyArr.forEach(function(i, index) {
      if (!tmpRef[i]) {
        tmpRef[i] = {};
      }
      tmpRef = tmpRef[i];
      if (index !== keyArr.length - 1) {
        if (!tmpRef.children) {
          tmpRef.children = [];
        }
        tmpRef = tmpRef.children;
      }
    });
    tmpRef.label = item.value;
    tmpRef.value = item.id;
    tmpRef.key = item.key;
    tmpRef.id = item.id;
    if (item.createBy) {
      tmpRef.isApproval = item.isApproval;
      tmpRef.createBy = item.createBy;
    }
  });
  return {
    treedata: result,
    checkpoints: checkpoints
  };
}

function getBugList(username, startDate, endDate) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection({
      host     : MYSQL_HOST,
      user     : MYSQL_USERNAME,
      password : MYSQL_PASSWORD,
      database : 'bugs'
    });

    connection.connect();
    connection.query(`SELECT bug_id, login_name, realname, extern_id, build_label, cf_reviewers, short_desc 
        FROM bugs
        LEFT JOIN profiles ON bugs.assigned_to = profiles.userid
        WHERE extern_id = '${username}' 
          AND lastdiffed BETWEEN '${startDate}' AND '${endDate}'
          AND (bug_status LIKE 'VERIFIED' OR bug_status LIKE 'RESOLVED' OR bug_status LIKE 'CLOSED')`, 
      function (error, results, fields) {
        console.log('error:', error);
        if (error) reject(error);
        resolve(results);
      }
    );
    connection.end();
  });  
}

function getReviewer(str) {
  let result = [];
  const branchReviewerStrList = str.split('\n');
  branchReviewerStrList.forEach(function(branchReviewerStr) {
    const match = branchReviewerStr.match('.*:(.*)');
    if (match && match.length > 1) {
      const reviewer = match[1].trim();
      if (reviewer.length) {
        result.push(reviewer);
      }
    }
  });
  return result;
}

export async function getBugCheckPointsHandler(req, res) {
  const checkpoints = await getCheckPoint();
  return res.json(checkpoints);
};

async function getWeeklyReport(user, account, date) {
  let weeklyBugReport = {
    summary: `# My Meat
Watch your meat, never let it being rapped by others, please update this report by daily
## Daily Tasks
1. Check GK2 Project Status(ETA, documents, bugs, tasks, escalation)
* 4.1.4-p2
* 3.2.3
* 3.2.2-p5

1. Domain knowledge Learning
1. Update daily jobs at here

-----
## Tasks
By priority(High to Row)
### DOING
1. Doing task 1
Paste the execute steps as your work log

1. Doing task 2
* sub item  1
* sub item 2

### TO DO
Once tasks assigned to you, please paste the tasks below, by priority
1. To do task 1
  comments here, 
1. To do task 2
  * sub item 1
  * sub item 2

### DONE
Everyday once you finished your jobs, please move your doing tasks under here
1. task1
1. task2

-----
## Daily learned
What you learned and studied, will review at Friday 3:00 to 4:00 PM each friday
* 5/15
Team managerment is also a project, to manage the team better, we need a higher but can be achieved goal,
to achieve this goal, we need a plan, the plan splitted many phases`,
    bugs: {}
  };

  const startDate = moment(date).startOf('week').format('YYYY-MM-DD h:m:s');
  const endDate = moment(date).endOf('week').format('YYYY-MM-DD h:m:s');

  // bug list from bugliza
  const bugList = await getBugList(account, startDate, endDate);
  console.log('bugList:', bugList);
  // weekly review bugs
  try {
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    const result = await r.db('work_genius').table('weekly_review_bugs').filter({ user, startDate }).limit(1).coerceTo('array').run(connection);
    await connection.close();

    if (result[0]) {
      weeklyBugReport = result[0].report;
    }
  } catch(e) {
    console.log(e);
  }

  for (let i = 0; i < bugList.length; i++) {
    const bug = bugList[i];
    weeklyBugReport.bugs[bug['bug_id']] = {
      ...bug,
      reviewer: getReviewer(bug['cf_reviewers']),
      ...(weeklyBugReport.bugs[bug['bug_id']] || {})
    }
  }
  console.log('weeklyBugReport:', weeklyBugReport);
  return weeklyBugReport;
}

export async function getWeeklyBugHandler(req, res) {
  const user = req.query.user;
  const date = req.query.date;
  const account = req.query.account;
  const result = await getWeeklyReport(user, account, date);
  return res.json(result);
};

export async function saveWeeklyBugReportHandler(req, res) {
  try {
    const date = req.body['date'];
    const user = req.body['user'];
    const account = req.body['account'];
    const report = JSON.parse(req.body['report']);

    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    for (const key in report.bugs) {
      const bugReport = report.bugs[key];
      if (bugReport.checkpoint) {
        const newCheckpoint = bugReport.checkpoint.substring(12).split('/');
        let newCheckpointKey = bugReport.checkpointKey;
        bugReport.checkpointKey = null;
        if (newCheckpointKey) {
          if (newCheckpoint.length > 0) {
            const oldCheckpoint = await r.db('work_genius').table('bug_check_points')
              .filter({key: newCheckpointKey}).coerceTo('array').run(connection);
            if (oldCheckpoint && oldCheckpoint.length) {
              bugReport.checkpoint = oldCheckpoint[0].id;
            } else {
              let finalCheckpoint;
              for (let i = newCheckpointKey.split('-').length - 1; i < newCheckpoint.length; i++) {
                const result = await r.db('work_genius').table('bug_check_points')
                  .insert({
                    value: newCheckpoint[newCheckpoint.length - 1],
                    key: newCheckpointKey,
                    createBy: user,
                    isApproval: false
                  }).run(connection);
                finalCheckpoint = result['generated_keys'][0];
                newCheckpointKey += '-0';
              }
              bugReport.checkpoint = finalCheckpoint;
            }
          }  else {
            bugReport.checkpoint = null;
          }
        }
      }
    }
    
    const startDate = moment(date).startOf('week').format('YYYY-MM-DD h:m:s');
    let result = await r.db('work_genius').table('weekly_review_bugs').filter({ user, startDate }).limit(1).coerceTo('array').run(connection);
    const weeklyReport = { 
      user, 
      startDate,
      report
    };
    if (result && result.length) {
      console.log(weeklyReport.report.bugs['395615']);
      result = await r.db('work_genius').table('weekly_review_bugs').filter({ user, startDate }).update(weeklyReport).run(connection);
    } else {
      result = await r.db('work_genius').table('weekly_review_bugs').insert(weeklyReport).run(connection);
    }
    await connection.close();

    const newWeeklyReport = await getWeeklyReport(user, account, date);
    const newCheckpoint = await getCheckPoint();
    return res.json({
      weeklyReport: newWeeklyReport,
      checkpoint: newCheckpoint
    });
  } catch(e) {
    return res.status(500).json({ msg: e.message });
  }
};

export async function removeCheckpoint(req, res) {
  const checkpointId = req.query.id;
  try {
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    await r.db('work_genius').table('bug_check_points').get(checkpointId).delete().run(connection);
    await connection.close();
  } catch(e) {
    return res.status(500).json({ msg: e.message });
  }

  try {
    const checkpoint = await getCheckPoint();
    return res.json(checkpoint);
  } catch(e) {
    return res.status(500).json({ msg: e.message });
  }
}

export async function approvalCheckpoint(req, res) {
  const checkpointId = req.query.id;
  try {
    const connection = await r.connect({ host: DB_HOST, port: DB_PORT });
    var checkpoint = await r.db('work_genius').table('bug_check_points').get(checkpointId).run(connection);
    checkpoint.isApproval = true;
    await r.db('work_genius').table('bug_check_points').get(checkpointId).update(checkpoint).run(connection);
    await connection.close();
  } catch(e) {
    return res.status(500).json({ msg: e.message });
  }
  
  try {
    const checkpoints = await getCheckPoint();
    return res.json(checkpoints);
  } catch(e) {
    return res.status(500).json({ msg: e.message });
  }
}
