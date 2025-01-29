/*var gzippo = require('gzippo');
var express = require('express');
var app = express();
var connect = require('connect');

var serveStatic = require('serve-static');
/*app.use(spa('dist/index.html'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));

app.use(function(req, res, next) {

  res.setHeader('Cache-Control', 'public, max-age=0');

  // Pass to next layer of middleware
  next();
});
app.listen(process.env.PORT || 3000);*/

//const PORT = process.env.PORT || 3001
//connect().use(serveStatic('app')).listen(PORT, () => console.log(`Listening on ${ PORT }`));

var exec = require('child_process').exec;

exec('npm start',
  function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });