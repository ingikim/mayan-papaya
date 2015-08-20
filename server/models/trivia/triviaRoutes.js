var triviaController = require('./triviaController.js');
var userController = require('../users/userController');
var unirest = require('unirest');
var Trivia = require('./triviaModel');

var cleanAnswer = function(answer) {
  return answer.replace(/<\/?i>/g, '');
};

module.exports = function(app){
  app.post('/', userController.checkAuth, triviaController.checkAnswer);
  app.get('/', userController.checkAuth, function(req, res){
    Trivia.find(function(err, questions) {
      if(err) {
        res.sendStatus(500);
      } else {
        res.send(JSON.stringify(questions));
      }
    });
  });
};
