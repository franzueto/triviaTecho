// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngOpenFB', 'ngCordova'])


.value('ParseConfiguration', {
  applicationId: "tkMF7B1eoP2uRDfuQPmGm5zXXnxUa4YxPjKRlCbg",
  javascriptKey: "opJpMr5OodNaMCzY86uX66LprUzNRzJt9Wuys7Oh"
})

.run(function($ionicPlatform, $state, $rootScope, ngFB, ParseConfiguration, $ionicHistory) {
  ngFB.init({appId: '449892315192982'});

  Parse.initialize(ParseConfiguration.applicationId, ParseConfiguration.javascriptKey);

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    //Parse.User.logOut();
    //$rootScope.user = null;
    //$rootScope.isLoggedIn = false;

    var currentUser = Parse.User.current();
    $rootScope.user = null;
    $rootScope.isLoggedIn = false;

    if (currentUser) {
      $rootScope.user = currentUser;
      $rootScope.isLoggedIn = true;
      $state.go('app.home', {clear: true});
    }
  });

})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('index', {
    url: '/index?clear',
    templateUrl: 'templates/login2.html',
    controller: 'LoginCtrl'
  })
  .state('loading', {
    url: '/loading',
    templateUrl: 'templates/loading.html',
    controller: 'LoadingCtrl'
  })
  .state('app.home', {
    url: '/home?clear',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.trivia', {
    url: '/trivia/?clear:category',
    views: {
      'menuContent': {
        templateUrl: 'templates/trivia.html',
        controller: 'TriviaCtrl'
      }
    }
  })
  .state('app.toptrivia', {
    url: '/toptrivia',
    views: {
      'menuContent': {
        templateUrl: 'templates/toptrivia.html',
        controller: 'TopTriviaCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/index');
});
