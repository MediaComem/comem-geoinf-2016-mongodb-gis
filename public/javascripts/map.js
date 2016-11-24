(function() {

  var app = angular.module('mongodb-gis');

  app.factory('MapService', function(mapStyles, $rootScope) {

    var map,
        readyDeferred = Promise.pending();

    var featuresSource = new ol.source.Vector({});
    var featuresLayer = new ol.layer.Vector({
      source: featuresSource,
      style: function(feature) {
        return mapStyles[feature.getGeometry().getType()];
      }
    });

    var drawSource = new ol.source.Vector({});
    var drawLayer = new ol.layer.Vector({
      source: drawSource
    });

    var drawInteraction = new ol.interaction.Draw({
      source: drawSource,
      type: 'Polygon'
    });

    var service = {
      events: $rootScope.$new()
    };

    service.ready = function() {
      return readyDeferred.promise;
    };

    service.clear = function() {
      drawSource.clear();
      featuresSource.clear();
    };

    service.reset = function(options) {

      service.clear();

      if (options && options.draw) {
        map.addInteraction(drawInteraction);
      } else {
        map.removeInteraction(drawInteraction);
      }
    };

    service.addFeatures = function(features) {
      if (!features) {
        return;
      }

      var mapFeatures = readFeatures(features);
      featuresSource.addFeatures(mapFeatures);
      return mapFeatures;
    };

    service.removeFeatures = function(features) {
      if (!features) {
        return;
      }

      _.each(_.isArray(features) ? features : [ features ], function(feature) {
        featuresSource.removeFeature(feature);
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
        radius: 5,
        fill: new ol.style.Fill({ color: 'blue' }),
        stroke: new ol.style.Stroke({color: 'red', width: 1})
      })
    }),
    MultiLineString: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'green',
        width: 2
      })
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
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
