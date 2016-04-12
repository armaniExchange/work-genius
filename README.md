# work-genius

:rocket: **Now  with [Babel 6](https://github.com/babel/babel) support!**

**Please remove Babel5 in your machine!**

1. npm uninstall -g babel
2. npm uninstall babel babel-core babel-eslint


## Install
1. Install Node 4.2.2+ from [here](https://nodejs.org/en/])
2. `git clone https://github.com/armaniExchange/work-genius.git`
3. `cd work-genius`
4. `npm install`
5. Since we will be working on "development" branch, we need to switch to it by: `git checkout -t -b development origin/development`


## Development
### Copy configs
1. `cp src/constants/config.js.dist src/constants/config.js`
2. `cp server/constants/configurations.js.dist server/constants/configurations.js`

### Start Server
You can choose to start the part you are working on or both:

Start front-end: `npm run dev`
Start back-end: `npm run serverDev`

To run both front-end and back-end: `npm run start`

## Tools
- Our database visualizer is located at `192.168.95.155:8080`
- You can use `postman` chrome extension to test out APIs
