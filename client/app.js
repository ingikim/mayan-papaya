(function() {

  var app = angular.module('TriviaWithFriends', ['ui.router', 'Navigation', 'Footer', 'Trivia', 'Profile', 'User', 'Stats']); // need User dependency
  app.run(function($rootScope, $location) {
    $rootScope.location = $location;
  });

  app.config ([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
      // .state('home', {
      //   url: '/home',
      //   templateUrl: 'views/home.html',
      //   data: { publicallyAccessible: false }
      // })
      .state('trivia', {
        url: '/trivia',
        templateUrl: 'views/trivia.html',
        data: { publicallyAccessible: false }
      })
          .state('trivia.categories', {
            url: '/categories',
            templateUrl: 'views/trivia.categories.html',
            data: { publicallyAccessible: false }
          })
          .state('trivia.play', {
            url: '/play',
            templateUrl: 'views/trivia.play.html',
            data: { publicallyAccessible: false }
          })
          .state('trivia.endgame', {
            url: '/endgame',
            templateUrl: 'views/trivia.endgame.html',
            data: { publicallyAccessible: false }
          })

      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        data: { publicallyAccessible: false }
      })
      .state('stats', {
        url: '/stats',
        templateUrl: 'views/stats.html',
        data: { publicallyAccessible: false }
      })
          .state('stats.global', {
            url: '/global',
            templateUrl: 'views/stats.global.html',
            data: { publicallyAccessible: false }
          })
          .state('stats.personal', {
            url: '/personal',
            templateUrl: 'views/stats.personal.html',
            data: { publicallyAccessible: false }
          })

      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        data: { publicallyAccessible: true }
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'views/signin.html',
        data: { publicallyAccessible: true }
      });
    $urlRouterProvider.otherwise('profile');
    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');

  }]);


  app.factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.TriviaWithFriends');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  .run(function ($rootScope, $state, UserFactory) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (!next.data.publicallyAccessible && !UserFactory.isAuth()) {
        event.preventDefault();
        $state.go('signin');
      }
    });
  });
})();

