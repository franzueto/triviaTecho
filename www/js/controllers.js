angular.module('starter.controllers', ['ngOpenFB'])

.controller('LoginCtrl', function($scope, $ionicModal, $timeout, ngFB) {
  $scope.fbLogin = function(){
    ngFB.login().then(
      function (response) {
        if (response.status === 'connected') {
          alert('Facebook login succeeded');
          console.log('Facebook login succeeded');
          //$scope.closeLogin();
        } else {
          alert('Facebook login failed');
        }
      });
  }
});
