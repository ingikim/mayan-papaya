var app = require('../../app');

module.exports = {
  startConnection: function(code) {
    console.log("connection: app is " + app);
    console.log("connection: app.app is " + app.app);
    console.log("connection: app.io is " + app.io);

    var namespace = app.io.of('/' + code);
    namespace.on('connection', function(socket) {
      console.log("connection: startConnection " + code);
    }); 
  },

};