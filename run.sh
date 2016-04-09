#/bin/bash
killall nohup
killall node
#/etc/init.d/rethinkdb restart
nohup npm run serverDev > server.log 2>&1 &
#nohup npm run dev > client.log 2>&1 &
service nginx restart
#echo 'show 8001 netstat'
#netstat -ano|grep 3000
echo 'show 3000 netstat'
netstat -ano|grep 8001
