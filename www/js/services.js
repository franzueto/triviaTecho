angular.module('starter.services', [])

.factory('Questions', function($q) {

  return {
    all: function(category, level) {
      var deferred = $q.defer();
      questions = [];
      var Question = Parse.Object.extend("Question");
      var queryQuestion = new Parse.Query(Question);
      queryQuestion.equalTo("category", category);
      queryQuestion.equalTo("level", level);
      queryQuestion.find({
        success: function (results) {
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var question = {
              question: result.get("question"),
              opt1: result.get("opt1"),
              opt2: result.get("opt2"),
              opt3: result.get("opt3"),
              opt4: result.get("opt4"),
              correct: result.get("correct")
            }
            questions.push(question);
          }
          deferred.resolve(questions);
        },
        error: function (error) {
          deferred.reject(error);
        }
      });
      return deferred.promise;
    }
  };
});
