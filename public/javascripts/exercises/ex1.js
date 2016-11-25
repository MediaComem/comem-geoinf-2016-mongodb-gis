(function() {

  addExercise({
    title: 'Filter by geometry type',
    template: buildTemplate(),
    controller: controller
  });

  function buildTemplate() {
    return `
      <div class='btn-group btn-group-justified'>
        <label class='btn btn-primary' ng-model='ctrl.filters.geometryType' ng-change='ctrl.onFilterChanged()' uib-btn-radio='"Polygon"'>Area</label>
        <label class='btn btn-primary' ng-model='ctrl.filters.geometryType' ng-change='ctrl.onFilterChanged()' uib-btn-radio='"MultiLineString"'>Routes</label>
        <label class='btn btn-primary' ng-model='ctrl.filters.geometryType' ng-change='ctrl.onFilterChanged()' uib-btn-radio='"Point"'>Stops</label>
      </div>
      <p ng-if='ctrl.apiError'>
        <api-error error='ctrl.apiError'></api-error>
      </p>
    `;
  }

  function controller(ExercisesService, $http, $log, MapService) {

    var ctrl = this;

    ctrl.filters = {
      geometryType: 'Polygon'
    };

    ExercisesService.onExerciseStarted(ctrl, function() {

      MapService.reset();
      delete ctrl.apiError;

      loadFeatures();
    });

    ctrl.onFilterChanged = function() {
      if (ExercisesService.isExerciseRunning(ctrl)) {
        loadFeatures();
      }
    };

    function loadFeatures() {
      MapService.clear();
      $log.debug('Fetching features of geometry type ' + ctrl.filters.geometryType);

      $http({
        url: '/api/geometryType/' + ctrl.filters.geometryType
      }).then(function(res) {
        MapService.addFeatures(res.data);
      }).catch(function(err) {
        ctrl.apiError = err;
        return Promise.reject(err);
      });
    }
  }
})();
