// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'ngOpenFB'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('index', {
    url: '/index',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/test.html'
      }
    }
  });

  $urlRouterProvider.otherwise('/index');
})

.run(function($ionicPlatform, $state, $rootScope, ngFB) {
  ngFB.init({appId: '449892315192982'});

  Parse.initialize("tkMF7B1eoP2uRDfuQPmGm5zXXnxUa4YxPjKRlCbg", "opJpMr5OodNaMCzY86uX66LprUzNRzJt9Wuys7Oh");

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
      $state.go('app.home');
    }
  });
});
