// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngOpenFB'])

.value('ParseConfiguration', {
        applicationId: "tkMF7B1eoP2uRDfuQPmGm5zXXnxUa4YxPjKRlCbg",
        javascriptKey: "opJpMr5OodNaMCzY86uX66LprUzNRzJt9Wuys7Oh"
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
    url: '/index',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/test.html',
        controller: 'TestCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/index');
})

.run(function($ionicPlatform, $state, $rootScope, ngFB, ParseConfiguration) {
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
      $state.go('app.home');
    }
  });
});
