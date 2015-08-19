var connection = require('../../config/connection');
var activeCodes = {};

module.exports = {

  // Generate a random code for a game "room" / socket namespace.
  newGame: function(req, res) {
    var code = Math.floor(Math.random() * 1000);

    // Try storing a list of the usernames for this game
    activeCodes[code] = [req.user.username];
    console.log("newGame: user list for " + code + " is " + activeCodes[code]);

    // Initiate socket.io connection
    connection.startConnection(code);

    res.json({code: code});
    // TODO? - setup additional game state?
  },

  joinGame: function(req, res) {
    var code = req.body.code;

    console.log("gameController: joinGame req for " + code);

    if (activeCodes[code]) {
      activeCodes[code].push(req.user.username);
      console.log("joinGame: user list for " + code + " is " + activeCodes[code]);
      connection.emitUserList(code, activeCodes[code]);
      res.send(200);
    } else {
      res.send(404);
    }
  },


  // TODO: need to have a function that ends game and removes the code for
  // that game

};