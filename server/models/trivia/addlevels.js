var fs = require('fs');
var questionsData = require('./questions');
var questionsData2 = require('./questions2');
var path = require('path');

var combined = {};
var Q_ID = 0;

/**
 * Combine the two sets of games into a common pool
 * Add level attribute for each question depending
 * on it's order in the current game
 */
var processGames = function(data) {
  for(var i = 0; i < data.games.length; i++) {
    var game = data.games[i];
    for(var j = 0; j < game.questions.length; j++) {
      var q = game.questions[j];
      q['level'] = j+1;
      q['id'] = Q_ID;
      combined[Q_ID] = q;
      Q_ID++;
    }
  }

}

var writeToFile = function() {
  var buffer = JSON.stringify(combined);
  var fd = fs.openSync(path.join(process.cwd(), 'triviaData.json'), 'a');
  fs.write(fd, buffer, function(err, data) {
    if(err) {console.log(err);}
    else { console.log("Wrote to file");}
  });
}
processGames(questionsData);
processGames(questionsData2);
writeToFile();
