controllers = angular.module('starter.controllers', ['ngOpenFB'])

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
                    user_parse.set("name", user.name);
                    user_parse.set("total_cat1", 0);
                    user_parse.set("total_cat2", 0);
                    user_parse.set("total_cat3", 0);
                    user_parse.set("total_cat4", 0);
                    user_parse.set("total_cat5", 0);
                    user_parse.set("total", 0);

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
})

.controller('HomeCtrl', function($cordovaMedia, $scope, $timeout, $state, $ionicHistory, $ionicNavBarDelegate, $stateParams, $window) {
  /*if ($stateParams.restart) {
    $window.location.reload(true);
    initialize();
  }*/

  var counter_change_time = 0;
  var counter_change_time_top = 12;
  var counter_change_time_max = 20;
  var WHEEL_INITIAL_TIMEOUT = 150;
  var wheel_flag = true;
  var start_trivia = false;

  function initialize() {
    $scope.max_total = 0;

    var currentUser = Parse.User.current();
    currentUser.fetch({
      success: function(currentUser) {
        $scope.max_total = currentUser.get('total');
      },
      error: function(currentUser, error) {

      }
    });

    counter_change_time = 0;
    counter_change_time_top = 12;
    counter_change_time_max = 20;
    WHEEL_INITIAL_TIMEOUT = 150;
    wheel_flag = true;
    start_trivia = false;

    $scope.txt_wheel_btn = "Empezar";

    clean_categories();
  }

  initialize();

/*for ios
function getMediaURL(s) {
    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
    return s;
}
*/

  function playMP3() {
    var mp3URL = "/android_asset/www/mp3/plop.mp3";
    var media = new Media(mp3URL, null, mediaError);
    $cordovaMedia.play(media);
  }

  function mediaError(e) {
    alert('Media Error');
    alert(JSON.stringify(e));
  }

  //playMP3();

  $scope.wheel = function() {
    if(wheel_flag){
      wheel_flag = false;
      counter_change_time = 0;
      start_wheel(WHEEL_INITIAL_TIMEOUT);
    } else if (start_trivia) {
      $state.go('app.trivia', {
        category: get_category_selected(),
        clear: true
      });
    }
  }

  function start_wheel(delay) {
    $timeout(function() {
      clean_categories();
      select_random_category();

      if(counter_change_time < counter_change_time_top){
        start_wheel(delay);
        counter_change_time++;
      } else{
        if(counter_change_time < counter_change_time_max){
          delay = WHEEL_INITIAL_TIMEOUT * 2;
          start_wheel(delay);
        } else{
          $scope.txt_wheel_btn = "Jugar";
          start_trivia = true;
          //wheel_flag = true;
        }
        counter_change_time++;
      }
    }, delay);
  }

  function clean_categories() {
    $scope.is_category1 = false;
    $scope.is_category2 = false;
    $scope.is_category3 = false;
    $scope.is_category4 = false;
    $scope.is_category5 = false;
  }

  function select_random_category() {
    var random_n = Math.floor((Math.random() * 5) + 1);
    console.log(random_n);

    switch (random_n) {
      case 1:
        $scope.is_category1 = true;
        break;
      case 2:
        $scope.is_category2 = true;
        break;
      case 3:
        $scope.is_category3 = true;
        break;
      case 4:
        $scope.is_category4 = true;
        break;
      case 5:
        $scope.is_category5 = true;
        break;
      default:
    }
    playMP3();
  }

  function get_category_selected() {
    if($scope.is_category1) return "CAT1";
    if($scope.is_category2) return "CAT2";
    if($scope.is_category3) return "CAT3";
    if($scope.is_category4) return "CAT4";
    if($scope.is_category5) return "CAT5";
  }
});
