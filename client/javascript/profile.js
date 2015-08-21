(function() {

  var app = angular.module('Profile',[]);


  app.factory('ProfileFactory', function($http, $location, $window) {

    var obj = {}; // export object so you can later add new objects and methods to our factories

    obj.getUsername = function() {
      return $window.localStorage.getItem('com.TriviaWithFriends.username') || 'User';
    };

    obj.getUserData = function (username) {
      return $http.post('/api/users/profile', {
        username: username
      }).then(function (res) {
        return res.data;
      });
    };

    return obj;
  });


  app.controller('ProfileController', ['$scope', 'ProfileFactory', function($scope, ProfileFactory) {

    //sample user data from DB, not used except for example
    $scope.user = {
      "_id": "55ce9311dda321437709f35c",
      "salt": "$2a$10$gLPRaKFp3JG6J2M\/VOQ.uu",
      "username": " ",
      "password": "$2a$10$gLPRaKFp3JG6J2M\/VOQ.uuE67zxeljbSnSp8DfWpwkOMsPHDw1wwW",
      "__v": 0,
      "mostRecentGame": {
        "questionsAnsweredCorrect": 0,
        "questionsAnswered": 0,
        "xpEarned": 0,
      },
      "questionsAnsweredCorrect": 0,
      "questionsAnswered": 0,
      "wonLastGame": false,
      "bestCorrectStreak": 0,
      "gamesPlayed": 0,
      "totalXp": 0,
      "userLevel": 1
    };

    ProfileFactory.getUserData(ProfileFactory.getUsername())
      .then(function(data) {
        $scope.user = JSON.parse(data);
      });

    $scope.userImage = (function() {
      var username = ProfileFactory.getUsername();
      var imageCode = username.charCodeAt(0) % 13;
      return '/assets/avatars/av-' + imageCode + '.jpg';
    })();

  }]);

})();
