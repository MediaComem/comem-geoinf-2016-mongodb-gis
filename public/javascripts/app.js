(function() {
  /**
   * Declare the main angular module for the application and its dependencies.
   */
  angular.module('mongodb-gis', [
    // Angular module dependencies.
    'ngAnimate',
    // Third-party module dependencies.
    'angular-loading-bar', // Automatic loading bar.
    'ui.bootstrap' // Bootstrap components written with Angular.
  ]);
})();

var exerciseNumber = 0;

/**
 * Registers an exercise to be complete.
 *
 * Exercises are actually Angular components. Each exercise should be registered in its own file
 * in /public/javascripts/exercises with this function. The files in that directory will automatically
 * be included with a <script> tag when the server starts.
 *
 * Each exercise will be displayed in a Bootstrap panel. Only one exercise can be running at any time.
 * The ExercisesService service provides utility functions to determine when an exercise starts and
 * whether it is currently running.
 *
 * @param {Object} options - Options for the exercise component.
 * @param {Function} options.controller - The controller of the exercise component.
 * @param {String} options.title - The title of the exercise (will be displayed in the exercise panel header).
 */
function addExercise(options) {

  // Increment the current exercise number and generate the corresponding component and controller names.
  var number = ++exerciseNumber,
      componentName = 'ex' + number,
      controllerName = 'Ex' + number + 'Ctrl',
      app = angular.module('mongodb-gis');

  // Extract the title from the options.
  var title = options.title;
  delete options.title;

  // Schedule the exercise to be registered at runtime with the ExercisesService service.
  app.run(function(ExercisesService) {
    ExercisesService.exercises.push({
      title: title,
      number: number,
      component: componentName
    });
  });

  // Create the exercise's component.
  app.component(componentName, _.defaults(options, {
    controller: _.noop,
    controllerAs: 'ctrl',
    bindings: {
      // The exercise.
      exercise: '<',
      // Whether the exercise's panel is currently open.
      isOpen: '<'
    }
  }));
}
