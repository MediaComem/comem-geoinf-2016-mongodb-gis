(function() {

  var app = angular.module('mongodb-gis');

  app.component('exercisesList', {
    template: `
      <uib-accordion>
        <div class='panel-default' ng-repeat='exercise in ctrl.exercises' uib-accordion-group heading='{{ exercise.title }} (Exercise {{ exercise.number }})' is-open='ctrl.accordion["ex" + exercise.number]'>
          <exercise-view exercise='exercise' is-open='ctrl.accordion["ex" + exercise.number]' on-open='ctrl.open(exercise)'></exercise-view>
        </div>
      </uib-accordion>
    `,
    controller: 'ExercisesListCtrl',
    controllerAs: 'ctrl',
    bindings: {}
  });

  app.controller('ExercisesListCtrl', function(ExercisesService, $location, $rootScope) {

    var ctrl = this;

    ctrl.exercises = ExercisesService.exercises;

    var exerciseNumber = parseInt($location.search().exercise, 10);
    if (isNaN(exerciseNumber) || !_.isNumber(exerciseNumber) || exerciseNumber < 1 || exerciseNumber > ExercisesService.exercises.length) {
      exerciseNumber = 1;
    }

    ctrl.accordion = {};
    ctrl.accordion['ex' + exerciseNumber] = true;

    ctrl.open = function(exercise) {
      $location.search('exercise', exercise.number);
    };

    $rootScope.$on('$locationChangeSuccess', function(event, newState, oldState) {
      var newExerciseNumber = $location.search().exercise;
      if (!ctrl.accordion['ex' + newExerciseNumber]) {
        ctrl.accordion['ex' + newExerciseNumber] = true;
      }
    });
  });

  app.component('exerciseView', {
    template: '<div></div>',
    controller: 'ExerciseViewCtrl',
    controllerAs: 'ctrl',
    bindings: {
      exercise: '<',
      isOpen: '<',
      onOpen: '&'
    }
  });

  app.controller('ExerciseViewCtrl', function($compile, $element, $scope) {

    var ctrl = this,
        exercise = ctrl.exercise,
        template = '<' + exercise.component + ' exercise="ctrl.exercise" is-open="ctrl.isOpen"></' + exercise.component + '>';

    ctrl.$onChanges = function(changes) {
      if (changes.isOpen && changes.isOpen.currentValue) {
        ctrl.onOpen();
      }
    }

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
