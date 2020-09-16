var _ = require('lodash'),
    app = require('../app'),
    bluebird = require('bluebird'),
    debug = require('debug')('mongodb-gis:data'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    zlib = require('zlib');

var readdir = bluebird.promisify(fs.readdir);

module.exports = function() {

  var dataDir = path.join(__dirname, '..', 'data'),
      featuresCol = app.db.collection('features');

  return Promise
    .resolve()
    .then(checkDataLoaded)
    .then(loadData);

  function checkDataLoaded() {
    return featuresCol.countDocuments();
  }

  function loadData(count) {
    if (count) {
      debug('Data already loaded (' + count + ' features)');
      return;
    }

    return Promise
      .resolve()
      .then(loadArea)
      .then(loadRoutes)
      .then(loadStops)
      .then(function() {
        debug('Data loaded');
      });
  }

  function loadArea() {
    return unzipFile(path.join(dataDir, 'area-los-angeles.json.gz')).then(function(contents) {
      return featuresCol.insert(rawDataToFeature(contents));
    });
  }

  function loadRoutes() {
    return unzipFile(path.join(dataDir, 'routes-los-angeles.json.gz')).then(function(contents) {
      return featuresCol.insertMany(_.map(contents.routes, rawDataToFeature));
    });
  }

  function loadStops() {
    return unzipFile(path.join(dataDir, 'stops-los-angeles.json.gz')).then(function(contents) {
      return featuresCol.insertMany(_.map(contents.stops, rawDataToFeature));
    });
  }

  function rawDataToFeature(data) {
    return {
      type: 'Feature',
      geometry: data.geometry,
      properties: _.omit(data, 'geometry')
    };
  }

  function unzipFile(file) {
    return new Promise(function(resolve, reject) {
      zlib.gunzip(fs.readFileSync(file), function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(result.toString()));
        }
      });
    })
  }
};
