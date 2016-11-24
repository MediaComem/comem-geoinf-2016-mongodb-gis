(function() {

  var app = angular.module('mongodb-gis');

  app.component('exercisesList', {
    templateUrl: '/templates/exercises.html',
    controller: 'ExercisesListCtrl',
    controllerAs: 'ctrl',
    bindings: {}
  });

  app.controller('ExercisesListCtrl', function(ExercisesService) {

    var ctrl = this;

    ctrl.exercises = ExercisesService.exercises;

    ctrl.accordion = {
      ex1: true
    };
  });

  app.component('exerciseView', {
    template: '<div></div>',
    controller: 'ExerciseViewCtrl',
    controllerAs: 'ctrl',
    bindings: {
      exercise: '<',
      isOpen: '<'
    }
  });

  app.controller('ExerciseViewCtrl', function($compile, $element, $scope) {

    var exercise = this.exercise,
        template = '<' + exercise.component + ' exercise="ctrl.exercise" is-open="ctrl.isOpen"></' + exercise.component + '>';

    $element.append($compile(template)($scope));
  });

  app.factory('ExercisesService', function(MapService) {

    var service = {
      exercises: []
    };

    service.onExerciseStarted = function(ctrl, callback) {

      var existingCallback = ctrl.$onChanges;

      ctrl.$onChanges = function(changes) {
        if (existingCallback) {
          existingCallback(changes);
        }

        if (changes.isOpen && changes.isOpen.currentValue) {
          MapService.ready().then(function() {
            callback(changes);
          });
        }
      };
    };

    service.isExerciseRunning = function(ctrl) {
      return ctrl.isOpen;
    };

    return service;
  });

})();
