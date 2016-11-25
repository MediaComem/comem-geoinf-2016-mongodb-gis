
(function() {

  var app = angular.module('mongodb-gis');

  app.factory('GeoService', function($http) {

    var service = {};

    service.addressFromCoordinates = function(lonLat) {
      return $http({
        url: 'https://nominatim.openstreetmap.org/reverse',
        params: {
          format: 'json',
          lat: lonLat[1],
          lon: lonLat[0],
          zoom: 18,
          addressdetails: 1
        }
      }).then(function(res) {
        return res.data;
      });
    };

    return service;
  });

})();
