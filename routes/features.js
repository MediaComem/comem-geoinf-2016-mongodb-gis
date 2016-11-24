var _ = require('lodash'),
    app = require('../app'),
    express = require('express'),
    path = require('path'),
    router = express.Router();

var root = path.resolve(path.join(__dirname, '..'));

router.get('/geometryType/:type', function(req, res, next) {

  var featuresCol = app.db.collection('features');

  var geometryType = req.params.type;

  var query = {
    /*
     * Write a MongoDB query to find all the features with a geometry of the specified type.
     *
     * MongoDB find: https://docs.mongodb.com/v3.2/reference/method/db.collection.find/
     * MongoDB Spatial Query Operators: https://docs.mongodb.com/v3.2/reference/operator/query-geospatial/
     * GeoJSON Specification: http://geojson.org/geojson-spec.html
     */
    'geometry.type': geometryType
  };

  if (_.isEmpty(query)) {
    return res.status(501).send('Hi! I\'m not implemented yet. I\'m in ' + getCodeLocation(-11) + '.');
  }

  featuresCol.find(query).limit(500).toArray().then(function(features) {
    res.json({
      type: 'FeatureCollection',
      features: features
    });
  }).catch(next);
});

router.get('/nearestStop', function(req, res, next) {

  var featuresCol = app.db.collection('features');

  var latitude = parseFloat(req.query.latitude),
      longitude = parseFloat(req.query.longitude);

  if (!_.isNumber(latitude)) {
    return res.status(422).send('Query parameter "latitude" is not a number');
  } else if (latitude < -90 || latitude > 90) {
    return res.status(422).send('Query parameter "latitude" is invalid (must be between -90 and 90, got ' + req.query.latitude + ')');
  } else if (!_.isNumber(longitude)) {
    return res.status(422).send('Query parameter "longitude" is not a number');
  } else if (longitude < -180 || longitude > 180) {
    return res.status(422).send('Query parameter "longitude" is invalid (must be between -180 and 180, got ' + req.query.longitude + ')');
  }

  var query = {
    /*
     * Write a MongoDB query to find the transportation stop that is nearest to the specified `latitude` and `longitude` coordinates.
     * The query must return a feature with a Point geometry.
     *
     * MongoDB find: https://docs.mongodb.com/v3.2/reference/method/db.collection.find/
     * MongoDB Spatial Query Operators: https://docs.mongodb.com/v3.2/reference/operator/query-geospatial/
     * GeoJSON Specification: http://geojson.org/geojson-spec.html
     */
     'geometry.type': 'Point',
      geometry: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [ longitude, latitude ]
          }
        }
      }
  };

  if (_.isEmpty(query)) {
    return res.status(501).send('Hi! I\'m not implemented yet. I\'m in ' + getCodeLocation(-12) + '.');
  }

  featuresCol.find(query).limit(1).toArray().then(function(features) {
    if (!features.length) {
      return res.sendStatus(404);
    }

    var stop = features[0];
    if (stop.geometry.type != 'Point') {
      throw new Error('The retrieved feature must be a Feature with a geometry of type Point');
    }

    res.json(stop);
  }).catch(next);
});

router.get('/within', function(req, res, next) {

  var featuresCol = app.db.collection('features');

  var coordinates = JSON.parse(req.query.coordinates);

  var query = {
    /*
     * Write a MongoDB query to find all the features within the specified array of coordinates.
     * The `coordinates` query parameter is a serialized array of coordinate pairs in the following format:
     *
     *     [[80,40], [60,30], [70,20]]
     *
     * MongoDB find: https://docs.mongodb.com/v3.2/reference/method/db.collection.find/
     * MongoDB Spatial Query Operators: https://docs.mongodb.com/v3.2/reference/operator/query-geospatial/
     * GeoJSON Specification: http://geojson.org/geojson-spec.html
     */
     geometry: {
       $geoWithin: {
         $geometry: {
           type: 'Polygon',
           coordinates: [ coordinates ]
         }
       }
     }
  };

  if (_.isEmpty(query)) {
    return res.status(501).send('Hi! I\'m not implemented yet. I\'m in ' + getCodeLocation(-14) + '.');
  }

  featuresCol.find(query).limit(500).toArray().then(function(features) {
    res.json({
      type: 'FeatureCollection',
      features: features
    });
  }).catch(next);
});

module.exports = router;

function getCodeLocation(lineDelta) {

  var stack = new Error().stack,
      parts = stack.split(/\n/)[2].replace(/^\s*at\s*/, '').split(/:/);

  return path.relative(root, parts[0]) + ' at line ' + (parseInt(parts[1], 10) + lineDelta);
}
