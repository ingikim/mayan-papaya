var gameController = require('./gameController');
var userController = require('../users/userController');

module.exports = function(app) {
  app.get('/', userController.checkAuth, gameController.newGame);
  app.put('/join', userController.checkAuth, gameController.joinGame);
};
