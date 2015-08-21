var mongoose = require('mongoose');

var TriviaSchema = new mongoose.Schema({
  id: Number,
  question: String,
  answer: Number,
  content: Array,
  level: Number,

});

module.exports = mongoose.model('Trivia', TriviaSchema);
