var userController = require('./userController.js');


module.exports = function (app) {
  // app === userRouter injected from middlware.js
  app.put('/', userController.updateUser);
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  // app.get('/signedin', userController.checkAuth);

  app.post('/profile', userController.checkAuth, userController.getUserData);
};

