// var connection = require('../../config/connection');
var app = require('../../../app');
var activeCodes = {};

module.exports = {

  startConnection: function(code) {
    console.log("connection: app is " + app);
    console.log("connection: app.app is " + app.app);
    console.log("connection: app.io is " + app.io);

    var namespace = app.io.of('/' + code);
    namespace.on('connection', function(socket) {
      console.log("connection: startConnection " + code);
      socket.on('newuser', function(username) {
        // store list of usernames here?
        activeCodes[code].push(username);
        namespace.emit('userlist', activeCodes[code]);
      });
      socket.on('startgame', function() {
        console.log("Socket: startgame");
        namespace.emit('startgame');
      });
    }); 
  },

  // Generate a random code for a game "room" / socket namespace.
  newGame: function(req, res) {
    var code = Math.floor(Math.random() * 1000);

    // Try storing a list of the usernames for this game
    // activeCodes[code] = [req.user.username];
    activeCodes[code] = [];
    console.log("newGame: user list for " + code + " is " + activeCodes[code]);

    // Initiate socket.io connection
    module.exports.startConnection(code);

    res.json({code: code});
    // TODO? - setup additional game state?
  },

  joinGame: function(req, res) {
    var code = req.body.code;

    console.log("gameController: joinGame req for " + code);

    if (activeCodes[code]) {
      // activeCodes[code].push(req.user.username);
      console.log("joinGame: user list for " + code + " is " + activeCodes[code]);
      // connection.emitUserList(code, activeCodes[code]);
      res.send(200);
    } else {
      res.send(404);
    }
  },


  // TODO: need to have a function that ends game and removes the code for
  // that game

};