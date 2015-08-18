var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var io = require('socket.io')();

require('./server/config/middleware.js')(app, express);

mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/TriviaWithFriends';

mongoose.connect(mongoURI);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db success');
});


// only run server if app.js was run directly (rather than being
// imported as a module)
if (!module.parent) {
  var port = process.env.PORT || 3000;

  var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });

  io.attach(server);
}

console.log("app.js: app is " + app);
console.log("app.js: io is " + io);

// module.exports = {
//   app: app,
//   io: io
// };

exports.app = app;
exports.io = io;








