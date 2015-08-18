var gameController = require('./gameController');

module.exports = function(app) {
  app.get('/', gameController.newGame);

};
