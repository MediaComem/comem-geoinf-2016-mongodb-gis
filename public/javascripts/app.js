(function() {

  angular

    .module('comem-geoinf-2016-mongodb-gis', [
      'ngAnimate',
      'ui.bootstrap'
    ])

    .component('transportationMap', {
      template: '<div class="map"></div>',
      controller: 'TransportationMapCtrl',
      bindings: {
      }
    })

    .controller('TransportationMapCtrl', function($element, $http) {

      var $map = $element.find('.map');

      $http({
        url: '/api/features',
        params: {
          geometryType: 'Polygon'
        }
      }).then(function(res) {

        var image = new ol.style.Circle({
          radius: 5,
          fill: null,
          stroke: new ol.style.Stroke({color: 'red', width: 1})
        });

        var styles = {
          'Point': new ol.style.Style({
            image: image
          }),
          'MultiLineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'green',
              width: 5
            })
          }),
          'Polygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'blue',
              lineDash: [4],
              width: 3
            }),
            fill: new ol.style.Fill({
              color: 'rgba(0, 0, 255, 0.1)'
            })
          })
        };

        var styleFunction = function(feature) {
          return styles[feature.getGeometry().getType()];
        };

        var vectorSource = new ol.source.Vector({
          features: (new ol.format.GeoJSON()).readFeatures(res.data, {
            featureProjection: 'EPSG:900913'
          })
        });

        var vectorLayer = new ol.layer.Vector({
          source: vectorSource,
          style: styleFunction
        });

        var map = new ol.Map({
          target: $map[0],
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            }),
            vectorLayer
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([-118.244476, 34.016775]),
            zoom: 9
          })
        });
      });
    })

  ;

  function rawDataToFeatures(data) {
    return _.map(data, function(feature) {

      var keys = _.keys(feature);
      feature.properties = {};

      _.each(keys, function(key) {
        feature.properties[key] = feature[key];
        delete feature[key];
      });

      feature.type = 'Feature';
      feature.geometry = feature.properties.geometry;
      delete feature.properties.geometry;

      return feature;
    });
  }

})();

var exerciseNumber = 0;

function addExercise(options) {

  var number = ++exerciseNumber,
      componentName = 'ex' + number,
      controllerName = 'Ex' + number + 'Ctrl',
      app = angular.module('comem-geoinf-2016-mongodb-gis');

  var title = options.title;
  delete options.title;

  app.run(function(ExercisesService) {
    ExercisesService.exercises.push({
      title: title,
      component: componentName
    });
  });

  app.component(componentName, _.defaults(options, {
    controller: _.noop,
    controllerAs: 'ctrl',
    bindings: {
      exercise: '='
    }
  }));
}
