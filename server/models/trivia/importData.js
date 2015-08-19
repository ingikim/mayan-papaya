var Trivia = require('./triviaModel');
var data = require('./triviaData');
var mongoose = require('mongoose');

/** 
 * Only need to do this if mongo is not already connected 
 * through app.js
 */
mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/TriviaWithFriends';
try {
  mongoose.connect(mongoURI);
} catch (e) {
  console.log("Already connected to Mongo? -> ", e);
}

console.log("\n");
console.log("*--------------------------------------*");
console.log("|          Beginning data import       |");
console.log("*--------------------------------------*");

for(var i = 0; i < 150; i++) {
  var question = new Trivia({
    id: i,
    question: data[i].question,
    content: data[i].content,
    answer: data[i].correct,
    level: data[i].level
  });
  
  question.save()
}

console.log("\n");
console.log("*--------------------------------------*");
console.log("|          Imported Q's to DB!         |");
console.log("*--------------------------------------*");
