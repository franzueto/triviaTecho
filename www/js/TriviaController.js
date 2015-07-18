controllers.controller('TriviaCtrl', function($window, $scope, Questions, $ionicLoading,
  $state, $stateParams, $ionicHistory, $ionicNavBarDelegate, $ionicPopup) {
  if ($stateParams.clear) {
    $ionicNavBarDelegate.showBackButton(false);
  }

  $scope.category = $stateParams.category;
  $scope.categoryName = get_nombre_categoria($scope.category);

  var counter_question = 0;
  $scope.lives = 3;
  $scope.points = 0;

  $scope.level = 1;

  function getQuestions(questionsQuery) {
    $scope.loading = $ionicLoading.show({
      content: 'Cargando Trivia',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    $scope.questions = questionsQuery
    .then(function(questions) {
        //modify data as necessary
        $scope.questions = questions;
        $scope.question = questions[counter_question];
        $ionicLoading.hide();
      }, function(reason) {
        showAlert('Failed: ' + reason);
        $ionicLoading.hide();
      }
    );
  }

  getQuestions(Questions.all($scope.category, $scope.level));

  function saveResult(cat, result) {
    $scope.loading = $ionicLoading.show({
      content: 'Guardando...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    var currentUser = Parse.User.current();
    if (currentUser) {
      var selected_category = get_category_selected(cat);

      currentUser.set(selected_category, result);
      currentUser.save(null, {
        success: function(currentUser) {
          // Execute any logic that should take place after the object is saved.
          $ionicLoading.hide();
          $state.go('loading', {});
        },
        error: function(currentUser, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          $ionicLoading.hide();
          $state.go('loading', {}).then(function(){
            //$window.location.reload(true);
          });
        }
      });
    } else {
      Parse.User.logOut();
      $rootScope.user = null;
      $rootScope.isLoggedIn = false;
      $state.go('index', {
        clear: true
      });
    }
  }

  $scope.answer = function(myAnswer) {
    if(!myAnswer){
      showAlert("¡Selecciona una opción para tu respuesta!");
      return;
    }

    if(myAnswer != $scope.question.correct){
      $scope.lives--;
      if($scope.lives >= 1){
        showAlert("¡Cuidado, perdiste una vida!");
      }
    } else{
      $scope.points++;
    }

    if($scope.lives < 1){
      showAlert("¡No lograste terminar esta categoría. Ánimo, vuelve a intentarlo!"
        , function () {
          saveResult($scope.category, $scope.points);
        }
      );
    } else{
      counter_question++;
      if(counter_question < $scope.questions.length){
        $scope.question = $scope.questions[counter_question];
      } else{
        if($scope.level>=1){
          showAlert("¡Felicidades! Lograste terminar esta categoría. Tu puntuación fue: " + $scope.points + " puntos."
            , function () {
              saveResult($scope.category, $scope.points);
            }
          );
        }else{
          $scope.level = $scope.level + 1;
          getQuestions(Questions.all($scope.category, $scope.level));
        }
      }
    }
  }

  function get_category_selected(cat) {
    if(cat === "CAT1") return "total_cat1";
    if(cat === "CAT2") return "total_cat2";
    if(cat === "CAT3") return "total_cat3";
    if(cat === "CAT4") return "total_cat4";
    if(cat === "CAT5") return "total_cat5";
  }

  function get_nombre_categoria(cat) {
    if(cat === "CAT1") return "Cultura Guatemalteca";
    if(cat === "CAT2") return "Pobreza y Desigualdad";
    if(cat === "CAT3") return "Historia Guatemalteca";
    if(cat === "CAT4") return "Personajes Guatemaltecos";
    if(cat === "CAT5") return "Ciudadanía";
  }

  function showAlert(texto, callback) {
    var alertPopup = $ionicPopup.alert({
      title: "Mensaje",
      template: texto
    });
    alertPopup.then(function(res) {
      if (callback != null && typeof callback === "function") {
        callback();
      }
    });
  }

  function showConfirm(texto, callback) {
    var alertPopup = $ionicPopup.alert({
      title: "Mensaje",
      template: texto
    });

  }

});
