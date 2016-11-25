(function() {
  angular.module('mongodb-gis', [
    // Angular modules.
    'ngAnimate',
    // Third-party modules.
    'angular-loading-bar',
    'ui.bootstrap'
  ]);
})();

var exerciseNumber = 0;

function addExercise(options) {

  var number = ++exerciseNumber,
      componentName = 'ex' + number,
      controllerName = 'Ex' + number + 'Ctrl',
      app = angular.module('mongodb-gis');

  var title = options.title;
  delete options.title;

  app.run(function(ExercisesService) {
    ExercisesService.exercises.push({
      title: title,
      number: number,
      component: componentName
    });
  });

  app.component(componentName, _.defaults(options, {
    controller: _.noop,
    controllerAs: 'ctrl',
    bindings: {
      exercise: '<',
      isOpen: '<'
    }
  }));
}
