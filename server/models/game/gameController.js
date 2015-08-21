var app = require('../../../app');

// GameState format: keyed by game code
// X - No longer using { users: [{username: 'user1', score: 123}, {username: 'user2', score: 50}, ...]
// { userScores: {user1: 123, user2: 50 ... }
//   numUsers: 2, // total players for this game
//   qNumber: 1, // current question being played
//   numUsersFinished: 0, // number of players who finished playing curr question
// }
var gameState = {};

module.exports = {

  initGameState: function(code) {
    gameState[code] = {};
    gameState[code].userScores = {};
    gameState[code].numUsers = 0;
    gameState[code].qNumber = 0;
    gameState[code].numUsersFinished = 0;
  },

  startConnection: function(code) {
    console.log("connection: app is " + app);
    console.log("connection: app.app is " + app.app);
    console.log("connection: app.io is " + app.io);

    var namespace = app.io.of('/' + code);
    namespace.on('connection', function(socket) {
      console.log("connection: startConnection " + code);

      socket.on('newuser', function(username) {
        gameState[code].userScores[username] = 0;
        gameState[code].numUsers++;
        namespace.emit('userlist', gameState[code].userScores);
      });

      socket.on('initiategame', function() {
        console.log("Socket: initiategame");

        // Select 10 random question numbers for this game
        var questions = [];
        var qHash = {};
        var numSelected = 0;

        while (numSelected < 10) {
          var q = Math.floor(Math.random() * 150);

          if (qHash[q] === undefined) {
            qHash[q] = true;
            questions.push(q);
            numSelected++;
          }
        }
        console.log("initiategame: questions ");
        console.log(questions);

        namespace.emit('startgame', questions);
      });

      socket.on('finishedq', function(data) {
        gameState[code].userScores[data.username] = data.score;
        gameState[code].numUsersFinished++;

        // if all the users have indicated being finished, broadcast
        // that the next question can be shown, or end game if all 
        // questions have already been played.
        if (gameState[code].numUsersFinished === gameState[code].numUsers) {
          gameState[code].numUsersFinished = 0;
          gameState[code].qNumber++;

          if (gameState[code].qNumber === 10) {
            // We've played through the end of the game; broadcast
            // the end and clean up game state for this game.
            namespace.emit('endgame', gameState[code].userScores);
            // delete gameState[code];
          } else {
            namespace.emit('nextq', gameState[code].userScores);
          }
        }

      });

      socket.on('scoreupdate', function(data) {
        console.log("Socket: scoreupdate");
        namespace.emit('scoreupdate', data);
      });
    }); 
  },

  // Generate a random code for a game "room" / socket namespace.
  newGame: function(req, res) {
    var code;

    // Select a random code for the game, checking that it is not
    // already in use.
    do{
      code = Math.floor(Math.random() * 1000);
    } while(gameState[code] !== undefined);
    
    module.exports.initGameState(code);

    // Initiate socket.io connection
    module.exports.startConnection(code);

    res.json({code: code});
  },

  joinGame: function(req, res) {
    var code = req.body.code;

    console.log("gameController: joinGame req for " + code);

    if (gameState[code]) {
      console.log("joinGame: user list for " + code + " is " + gameState[code].userScores);
      res.send(200);
    } else {
      res.send(404);
    }
  },

};