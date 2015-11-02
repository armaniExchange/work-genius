var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var opn = require('opn');

var app = express();
var compiler = webpack(config);
var PORT = process.argv[2] ? parseInt(process.argv[2]) : 8080;

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:' + PORT);
    opn('http://localhost:' + PORT);
});
