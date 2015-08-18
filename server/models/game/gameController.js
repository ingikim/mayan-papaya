
var activeCodes = {};

module.exports = {

  // Generate a random code for a game "room" / socket namespace.
  newGame: function(req, res) {
    var code = Math.floor(Math.random() * 1000);

    // Arbitrarily 1 for now; can possibly represent number of players per code
    activeCodes[code] = 1; 
    res.json({code: code});
    // TODO? - setup additional game state?
  },

  joinGame: function(req, res) {
    var code = req.body.code;

    console.log("gameController: joinGame req for " + code);

    if (activeCodes[code]) {
      activeCodes[code]++;
      res.send(200);
    } else {
      res.send(404);
    }
  },


  // TODO: need to have a function that ends game and removes the code for
  // that game

};