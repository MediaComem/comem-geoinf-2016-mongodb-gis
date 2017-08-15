(function() {

  var app = angular.module('mongodb-gis');

  /**
   * Service providing geographic information processing utilities.
   */
  app.factory('GeoService', function($http) {

    var service = {};

    /**
     * Performs a reverse geocoding request to obtain the address corresponding to the specified longitude and latitude.
     *
     * @param {Object} lonLat
     * @param {Number} lonLat.latitude - The latitude.
     * @param {Number} lonLat.longitude - The longitude.
     * @returns Promise
     */
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
