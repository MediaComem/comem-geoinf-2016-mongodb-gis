(function() {

  var app = angular.module('comem-geoinf-2016-mongodb-gis');

  app.component('exercisesList', {
    templateUrl: '/templates/exercises.html',
    controller: 'ExercisesListCtrl',
    controllerAs: 'ctrl',
    bindings: {
    }
  });

  app.controller('ExercisesListCtrl', function(ExercisesService) {
    this.exercises = ExercisesService.exercises;
  });

  app.component('exerciseView', {
    template: '<div></div>',
    controller: 'ExerciseViewCtrl',
    controllerAs: 'ctrl',
    bindings: {
      exercise: '='
    }
  });

  app.controller('ExerciseViewCtrl', function($compile, $element, $scope) {

    var exercise = this.exercise;

    var template = '<' + exercise.component + ' exercise="exercise"></' + exercise.component + '>';

    var scope = $scope.$new();
    scope.exercise = exercise;

    $element.append($compile(template)(scope));
  });

  app.factory('ExercisesService', function() {

    var service = {
      exercises: []
    };

    return service;
  });

})();
