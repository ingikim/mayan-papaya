

module.exports = {

  // Generate a random code for a game "room" / socket namespace.
  newGame: function(req, res) {
    var code = Math.floor(Math.random() * 1000);
    res.json({code: code});
    // TODO? - setup additional game state?
  },

};