(function() {

  var app = angular.module('mongodb-gis');

  app.factory('FeaturesApiService', function($http, $log, MapService) {

    var service = {};

    service.loadFeaturesByGeometryType = function(geometryType) {

      $log.debug('Fetching features of geometry type ' + geometryType);

      return $http({
        url: '/api/geometryType/' + geometryType
      }).then(extractResponseData);
    };

    service.loadStopNearestTo = function(lonLat) {

      $log.debug('Fetching stop nearest to ' + JSON.stringify(lonLat));

      return $http({
        url: '/api/nearestStop',
        params: {
          latitude: lonLat[1],
          longitude: lonLat[0]
        }
      }).then(extractResponseData);
    };

    service.loadFeaturesWithinPolygon = function(geometry) {

      $log.debug('Fetching features within ' + JSON.stringify(geometry));

      return $http({
        url: '/api/within',
        params: {
          coordinates: JSON.stringify(geometry.coordinates[0])
        }
      }).then(extractResponseData);
    };

    return service;
  });

  function extractResponseData(res) {
    return res.data;
  }
})();
