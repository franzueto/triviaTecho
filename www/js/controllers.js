angular.module('starter.controllers', ['ngOpenFB'])

.controller('AppCtrl', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
  if ($stateParams.clear) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }

  $scope.logout = function() {
    Parse.User.logOut();
    $rootScope.user = null;
    $rootScope.isLoggedIn = false;
    $state.go('index', {
      clear: true
    });
  };
})

.controller('LoginCtrl', function($scope, $rootScope, $state, $ionicLoading, $ionicHistory, $stateParams, ngFB) {
  if ($stateParams.clear) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }

  $scope.fbLogin = function(){
    $scope.loading = $ionicLoading.show({
      content: 'Logging in',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    ngFB.login().then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');

          ngFB.api({
            path: '/me',
            params: {fields: 'id,name'}
          }).then(
            function (user) {
                $scope.user = user;

                Parse.User.logIn(user.id, user.id, {
                  success: function(user_logged) {
                    // Do stuff after successful login.
                    $rootScope.user = user_logged;
                    $rootScope.isLoggedIn = true;
                    $ionicLoading.hide();
                    $state.go('app.home');
                  },
                  error: function(user_logged, error) {
                    var user_parse = new Parse.User();
                    user_parse.set("username", user.id);
                    user_parse.set("password", user.id);

                    user_parse.signUp(null, {
                      success: function(user_parse_signed) {
                        console.log(user_parse_signed);
                        $rootScope.user = user_parse_signed;
                        $rootScope.isLoggedIn = true;
                        $ionicLoading.hide();
                        $state.go('app.home');
                      },
                      error: function(user_parse_signed, error) {
                        // Show the error message somewhere and let the user try again.
                        $ionicLoading.hide();
                        alert("Error: " + error.code + " " + error.message);
                      }
                    });
                  }
                });
            },
            function (error) {
              $ionicLoading.hide();
              alert('Facebook error: ' + error.error_description);
            });
        } else {
          alert('Facebook login failed');
          $ionicLoading.hide();
        }
      });
  }
});
