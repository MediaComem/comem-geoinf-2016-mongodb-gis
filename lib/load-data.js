var _ = require('lodash'),
    app = require('../app'),
    bluebird = require('bluebird'),
    debug = require('debug')('comem-geoinf-2016-nosql-gis:data'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird');

var readdir = bluebird.promisify(fs.readdir);

module.exports = function() {

  var dataDir = path.join(__dirname, '..', 'data'),
      features = app.db.collection('features');

  var area = require(path.join(dataDir, 'area-los-angeles')),
      routes = require(path.join(dataDir, 'routes-los-angeles')),
      stops = require(path.join(dataDir, 'stops-01-los-angeles'));

  return Promise
    .resolve()
    .then(clearPreviousData)
    .then(loadData);

  function clearPreviousData() {
    return features.deleteMany({}).then(function() {
      debug('Previous data cleared');
    });
  }

  function loadData() {
    return Promise.all([
      loadArea(),
      loadRoutes(),
      loadStops()
    ]).then(function() {
      debug('Data loaded');
    });
  }

  function loadArea() {
    return features.insert(rawDataToFeature(area));
  }

  function loadRoutes() {
    return features.insertMany(_.map(routes.routes, rawDataToFeature));
  }

  function loadStops() {
    return features.insertMany(_.map(stops.stops, rawDataToFeature));
  }

  function rawDataToFeature(data) {
    return {
      type: 'Feature',
      geometry: data.geometry,
      properties: _.omit(data, 'geometry')
    };
  }
};
