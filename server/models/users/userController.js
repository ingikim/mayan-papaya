var User = require('./userModel.js'),
    Q    = require('q'),
    jwt  = require('jwt-simple');

var secret = 'This really shouldn\'t be in the git repo. Replace with a secure secret eventually.';

module.exports = {

  updateUser: function(req, res){
    var username = req.body.username;
    var userLevel;
    var score = req.body.score;
    var correct = req.body.correct;
    var correctStreak = req.body.correctStreak;
    var answered = req.body.answered;
    var query = {username: username};
    var oldScore;
    var newScore;
    var oldGames;
    var bestGameScore;
    var bestCorrectStreak;
    var questionsAnswered;
    var questionsAnsweredCorrect;
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function(user){
        oldScore = user.totalXp;
        newScore = oldScore + score;
        oldGames = user.gamesPlayed;
        questionsAnswered = user.questionsAnswered + answered;
        questionsAnsweredCorrect = user.questionsAnsweredCorrect + correct;
        userLevel = Math.ceil(0.05 * Math.sqrt(newScore));
        if(user.bestGameScore < score){
          bestGameScore = score;
        }else{
          bestGameScore = user.bestGameScore;
        }
        if(user.bestCorrectStreak < correctStreak){
          bestCorrectStreak = correctStreak;
        }else{
          bestCorrectStreak = user.bestCorrectStreak;
        }
      }).then(function(){
        User.findOneAndUpdate(query, {totalXp: newScore}, function(arg){
          //null
        });
        User.findOneAndUpdate(query, {gamesPlayed: oldGames + 1}, function(arg){
          //null
        });
        User.findOneAndUpdate(query, {bestGameScore: bestGameScore}, function(arg){
          //null
        });
        User.findOneAndUpdate(query, {bestCorrectStreak: bestCorrectStreak}, function(arg){
          //null
        });
        User.findOneAndUpdate(query, {questionsAnswered: questionsAnswered}, function(arg){
          //null
        });
        User.findOneAndUpdate(query, {questionsAnsweredCorrect: questionsAnsweredCorrect}, function(arg){
          //null
        });
        User.findOneAndUpdate(query, {userLevel: userLevel}, function(arg){
          //null
        });
        User.findOneAndUpdate(query, { 
          mostRecentGame: {
            xpEarned: score,
            questionsAnswered: answered,
            questionsAnsweredCorrect: correct
          }
        }, function(arg){
          //null
        });
      });
  },

  signin: function (req, res) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        console.log(user);
        if (!user) {
          res.statusCode = 403;
          res.json({error: 'Incorrect username or password'});
        } else {
          user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, secret);
                res.json({token: token});
              } else {
                res.statusCode = 403;
                res.json({error: 'Incorrect username or password'});
              }
            });
        }
      })
      .fail(function (error) {
        res.statusCode = 403;
        res.json({error: 'Incorrect username or password'});
      });
  },

  signup: function (req, res) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);
    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        console.log('^^^^^^^^^^^', user);
        if (user) {
          res.statusCode = 403;
          res.json({error: 'Username taken'});
        } else {
          // make a new user if not one
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          console.log('``````````', newUser);
          return create(newUser);
        }
      })
      .then(function (user) {
        console.log('got here: then', user);
        // create token to send back for auth
        var token = jwt.encode(user, secret);
        res.json({token: token});
      })
      .fail(function (error) {
        console.log('Signup error:', error);
        res.statusCode = 500;
        res.json({error: 'Server error'});
      });
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];

    console.log("checkAuth called.");

    if (!token) {
      res.statusCode = 403;
      res.json({error: 'No token provided'});
    } else {
      var user = jwt.decode(token, secret);
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            console.log("checkAuth: found user " + user.username);
            req.user = foundUser;
            // res.sendStatus(200);
            next();
          } else {
            res.sendStatus(401);
          }
        })
        .fail(function (error) {
          res.statusCode = 500;
          res.json({error: 'Server error'});
        });
    }
  },

  getUserData: function(req, res) {
    console.log(req.body);
    var username = req.body.username;
    var findUser = Q.nbind(User.findOne, User);
    // console.log('username received: ' + username);
    if(!username) {
      res.sendStatus(401);
    }
    findUser({username: username})
      .then(function(user) {
        console.log("getUserData: " + user);
        res.json(JSON.stringify(user));
      });
  }
};

