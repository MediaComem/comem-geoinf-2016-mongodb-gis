(function() {

  var app = angular.module('mongodb-gis');

  /**
   * Service to manage the map, including:
   *
   * * adding/removing GeoJSON features;
   * * drawing polygons;
   * * detecting click events.
   *
   * This functionality is implemented with the OpenLayers library.
   */
  app.factory('MapService', function(mapStyles, $rootScope) {

    var map,
        readyDeferred = Promise.pending();

    // Prepare the layer on which features will be drawn.
    var featuresSource = new ol.source.Vector({});
    var featuresLayer = new ol.layer.Vector({
      source: featuresSource,
      style: function(feature) {
        return mapStyles[feature.getGeometry().getType()];
      }
    });

    // Prepare the layer on which the user will be able to draw polygons.
    var drawSource = new ol.source.Vector({});
    var drawLayer = new ol.layer.Vector({
      source: drawSource
    });

    // Prepare the draw interaction component.
    var drawInteraction = new ol.interaction.Draw({
      source: drawSource,
      type: 'Polygon'
    });

    // Create the service.
    var service = {
      // Event bus.
      events: $rootScope.$new()
    };

    /**
     * Returns a promise that will be resolved when the map is ready.
     *
     * @returns Promise
     */
    service.ready = function() {
      return readyDeferred.promise;
    };

    /**
     * Clears all GeoJSON features and drawn shapes on the map.
     */
    service.clear = function() {
      drawSource.clear();
      featuresSource.clear();
    };

    /**
     * Resets the map to the specified configuration (also clears all GeoJSON features and drawn shapes).
     *
     * @param {Object} options
     * @param {Boolean} options.draw - If true, the user will be able to draw polygons on the map.
     */
    service.reset = function(options) {

      // Clears all features and shapes.
      service.clear();

      // Enable or disable the draw interaction component depending on the option.
      if (options && options.draw) {
        map.addInteraction(drawInteraction);
      } else {
        map.removeInteraction(drawInteraction);
      }
    };

    /**
     * Adds the specified GeoJSON features (or feature collection) to the map.
     * This function returns the ol.Feature objects that were actually added to the map.
     *
     * @param {Object|Object[]} geoJsonFeatures - The GeoJSON feature collection object or features array to add.
     * @returns {ol.Feature[]} The features objects added to the map.
     */
    service.addFeatures = function(geoJsonFeatures) {
      if (!geoJsonFeatures) {
        return;
      }

      var olFeatures = readFeatures(geoJsonFeatures);
      featuresSource.addFeatures(olFeatures);

      return olFeatures;
    };

    /**
     * Removes the specified ol.Feature objects from the map.
     *
     * @param {ol.Feature[]} olFeatures - The feature object(s) to remove.
     */
    service.removeFeatures = function(olFeatures) {
      if (!olFeatures) {
        return;
      }

      _.each(_.isArray(olFeatures) ? olFeatures : [ olFeatures ], function(olFeature) {
        featuresSource.removeFeature(olFeature);
      });
    };

    service.clickEventToLonLat = function(clickEvent) {
      return ol.proj.transform(clickEvent.coordinate, 'EPSG:3857', 'EPSG:4326');
    };

    service.createMap = function($element) {

      map = new ol.Map({
        target: $element[0],
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          featuresLayer,
          drawLayer
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([-118.244476, 34.016775]),
          zoom: 9
        })
      });

      map.on('click', function(event) {
        $rootScope.$apply(function() {
          service.events.$broadcast('click', event);
        });
      });

      readyDeferred.resolve();
    };

    drawInteraction.on('drawstart', function() {
      service.events.$broadcast('drawstart');
    });

    drawInteraction.on('drawend', function(event) {
      service.events.$broadcast('drawend', writeFeature(event.feature));
    });

    return service;
  });

  app.component('transportationMap', {
    template: '<div class="map"></div>',
    controller: 'TransportationMapCtrl',
    bindings: {}
  });

  app.controller('TransportationMapCtrl', function($element, $http, MapService, $scope) {
    MapService.createMap($element.find('.map'));
  });

  app.constant('mapStyles', {
    Point: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({ color: '#800000' }),
        stroke: new ol.style.Stroke({color: '#cc0000', width: 1})
      })
    }),
    MultiLineString: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#3366ff',
        width: 2
      })
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '00cc66',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 204, 102, 0.1)'
      })
    })
  });

  function readFeatures(features) {
    return (new ol.format.GeoJSON()).readFeatures(features, {
      featureProjection: 'EPSG:3857'
    });
  }

  function writeFeature(feature) {
    return new ol.format.GeoJSON().writeFeatureObject(feature, {
      featureProjection: 'EPSG:3857',
      dataProjection: 'EPSG:4326'
    });
  }
})();
