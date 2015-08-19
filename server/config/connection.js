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
    // app.io.on('connection', function(socket) {
    //   console.log("connection: startConnection " + code);
    // }); 
  },

  emitUserList: function(code, userList) {
    console.log("emitUserList: " + code + " " + userList);

    var namespace = app.io.of('/' + code);
    namespace.emit('userlist', userList);
  },

};