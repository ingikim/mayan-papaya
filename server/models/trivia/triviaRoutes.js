var triviaController = require('./triviaController.js');
var unirest = require('unirest');
var data = require('./triviaData');

var cleanAnswer = function(answer) {
  return answer.replace(/<\/?i>/g, '');
};

module.exports = function(app){
  app.post('/', triviaController.checkAnswer);
  app.get('/', function(req, res){
    res.send(data);
  });
  
//  app.get('/', function(req, res) {
//    unirest.get("http://jservice.io/api/random?count=100") // changed to 100
//    .header("Accept", "application/json")
//    .end(function (result) {
//      var pureQuestionsArr = [];
//      triviaController.addQuestion(result);
//      for(var i = 0; i < result.body.length; i++){
//        var questionObj = result.body[i];
//        var answer = questionObj.answer;
//        questionObj.clue = triviaController.getClue(cleanAnswer(questionObj.answer));
//        if (/[^a-z]/i.test(answer) || answer === '') { // ^a-z means NOT a letter
//          delete questionObj.answer;
//        } else {
//          delete questionObj.answer;
//          pureQuestionsArr.push(questionObj);
//        }
//      }
//      res.send(pureQuestionsArr);
//    });
//  });
//
};
