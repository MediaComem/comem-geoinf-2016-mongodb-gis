(function() {

  addExercise({
    title: 'Find the nearest stop',
    template: buildTemplate(),
    controller: controller
  });

  function buildTemplate() {
    return `
      <p>Click on the map to find the nearest stop.</p>
      <ul class='list-group'>
        <li class='list-group-item'>
          <p class='text-muted' ng-if='!ctrl.startingPoint'>No starting point selected</p>
          <p class='text-info' ng-if='ctrl.startingPoint'>
            <strong>Starting point:</strong>
            <span ng-if='ctrl.startingPoint.address'>{{ ctrl.startingPoint.address }}</span>
            <span ng-if='!ctrl.startingPoint.address'>{{ ctrl.startingPoint.lonLat[0] }}, {{ ctrl.startingPoint.lonLat[1] }}</span>
          </p>
        </li>
        <li class='list-group-item'>
          <p class='text-muted' ng-if='!ctrl.nearestStop && !ctrl.apiError'>No nearest stop found</p>
          <p class='text-success' ng-if='ctrl.nearestStop'>
            <strong>Nearest stop:</strong>
            <span ng-if='ctrl.nearestStop.address'>{{ ctrl.nearestStop.address }}</span>
            <span ng-if='!ctrl.nearestStop.address'>{{ ctrl.nearestStop.lonLat[0] }}, {{ ctrl.nearestStop.lonLat[1] }}</span>
          </p>
          <api-error error='ctrl.apiError' ng-if='ctrl.apiError'></api-error>
        </li>
      </ul>
    `;
  }

  function controller(ExercisesService, GeoService, $http, $log, MapService) {

    var ctrl = this,
        nearestStopMapFeatures;

    ExercisesService.onExerciseStarted(ctrl, function() {

      MapService.reset();
      delete ctrl.apiError;
      delete ctrl.startingPoint;
      delete ctrl.nearestStop;
      nearestStopMapFeatures = null;

      $http({
        url: '/api/geometryType/MultiLineString'
      }).then(function(res) {
        MapService.addFeatures(res.data);
      });
    });

    MapService.events.$on('click', function(event, clickEvent) {
      if (ExercisesService.isExerciseRunning(ctrl)) {

        if (nearestStopMapFeatures) {
          MapService.removeFeatures(nearestStopMapFeatures);
        }

        var lonLat = MapService.clickEventToLonLat(clickEvent);

        return setStartingPoint(lonLat)
          .then(loadNearestStop);
      }
    });

    function setStartingPoint(lonLat) {
      return reverseGeocode(lonLat).then(function(point) {
        ctrl.startingPoint = point;
        return point;
      });
    }

    function loadNearestStop() {

      $log.debug('Fetching stop nearest to ' + JSON.stringify(ctrl.startingPoint.lonLat));

      return $http({
        url: '/api/nearestStop',
        params: {
          latitude: ctrl.startingPoint.lonLat[1],
          longitude: ctrl.startingPoint.lonLat[0]
        }
      }).then(function(res) {

        var stop = res.data;
        nearestStopMapFeatures = MapService.addFeatures(stop);

        return reverseGeocode(stop.geometry.coordinates).then(function(point) {
          ctrl.nearestStop = point;
          return point;
        });
      }).catch(function(err) {
        ctrl.apiError = err;
        return Promise.reject(err);
      });
    }

    function reverseGeocode(lonLat) {
      return GeoService.addressFromCoordinates(lonLat).then(function(data) {
        return {
          lonLat: lonLat,
          address: data.display_name
        };
      }).catch(function(err) {
        return {
          lonLat: lonLat
        };
      });
    }
  }
})();
