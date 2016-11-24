var _ = require('lodash'),
    app = require('../../app'),
    express = require('express'),
    router = express.Router(),
    utils = require('../../lib/api');

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
  };

  if (_.isEmpty(query)) {
    return res.status(501).send('Hi! I\'m not implemented yet. I\'m in ' + utils.getCodeLocation(-12) + '.');
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

module.exports = router;
