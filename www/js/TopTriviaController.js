controllers.controller('TopTriviaCtrl', function($scope, $ionicLoading, $window) {
  $scope.items = [];

  get_top_trivia();

  function get_top_trivia() {
    $scope.loading = $ionicLoading.show({
      content: 'Guardando...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    var query = new Parse.Query(Parse.User);
    query.descending("total");
    query.find({
      success: function(users) {
        $ionicLoading.hide();
        $scope.items = users;
      },
      error: function(currentUser, error) {
        $ionicLoading.hide();
      }
    });
  }

  $scope.refresh = function() {
    //$window.location.reload(true);
    console.log("go");
    get_top_trivia();
  }

});
