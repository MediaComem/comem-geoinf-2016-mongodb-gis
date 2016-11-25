(function() {

  addExercise({
    title: 'Find all features within an area',
    template: buildTemplate(),
    controller: controller
  });

  function buildTemplate() {
    return `
      <p>Draw a shape to find all routes and stops within it.</p>
      <ul class='list-group'>
        <li class='list-group-item'>
          <p class='text-muted' ng-if='!ctrl.apiError'>Click on the map to start drawing a shape. Double click to finish drawing.</p>
          <p class='text-success' ng-if='ctrl.featuresCount === 0 || ctrl.featuresCount'>{{ ctrl.featuresCount }} features found in the specified area.</p>
          <api-error error='ctrl.apiError' ng-if='ctrl.apiError'></api-error>
        </li>
      </li>
    `;
  }

  function controller(ExercisesService, $http, $log, MapService) {

    var ctrl = this;

    ExercisesService.onExerciseStarted(ctrl, function() {

      MapService.reset({
        draw: true
      });

      delete ctrl.apiError;
      delete ctrl.featuresCount;
    });

    MapService.events.$on('drawstart', function() {
      if (ExercisesService.isExerciseRunning(ctrl)) {
        MapService.clear();
        delete ctrl.apiError;
        delete ctrl.featuresCount;
      }
    });

    MapService.events.$on('drawend', function(event, feature) {
      if (ExercisesService.isExerciseRunning(ctrl)) {

        $log.debug('Fetching features within ' + JSON.stringify(feature.geometry));

        $http({
          url: '/api/within',
          params: {
            coordinates: JSON.stringify(feature.geometry.coordinates[0])
          }
        }).then(function(res) {
          var features = MapService.addFeatures(res.data);
          ctrl.featuresCount = features.length;
        }).catch(function(err) {
          ctrl.apiError = err;
          return Promise.reject(err);
        });
      }
    });
  }
})();
