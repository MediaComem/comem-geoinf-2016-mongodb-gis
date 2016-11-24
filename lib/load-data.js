var _ = require('lodash'),
    app = require('../app'),
    bluebird = require('bluebird'),
    debug = require('debug')('mongodb-gis:data'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird');

var readdir = bluebird.promisify(fs.readdir);

module.exports = function() {

  var dataDir = path.join(__dirname, '..', 'data'),
      featuresCol = app.db.collection('features');

  return Promise
    .resolve()
    .then(checkDataLoaded)
    .then(loadData);

  function checkDataLoaded() {
    return featuresCol.count();
  }

  function loadData(count) {
    if (count) {
      debug('Data already loaded (' + count + ' features)');
      return;
    }

    return Promise.all([
      loadArea(),
      loadRoutes(),
      loadStops()
    ]).then(function() {
      debug('Data loaded');
    });
  }

  function loadArea() {
    var area = require(path.join(dataDir, 'area-los-angeles'));
    return featuresCol.insert(rawDataToFeature(area));
  }

  function loadRoutes() {
    var routes = require(path.join(dataDir, 'routes-los-angeles'));
    return featuresCol.insertMany(_.map(routes.routes, rawDataToFeature));
  }

  function loadStops() {
    var stops = require(path.join(dataDir, 'stops-01-los-angeles'));
    return featuresCol.insertMany(_.map(stops.stops, rawDataToFeature));
  }

  function rawDataToFeature(data) {
    return {
      type: 'Feature',
      geometry: data.geometry,
      properties: _.omit(data, 'geometry')
    };
  }
};
