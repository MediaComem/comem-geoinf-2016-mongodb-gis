var _ = require('lodash'),
    app = require('../../app'),
    express = require('express'),
    router = express.Router(),
    utils = require('../../lib/api');

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
    return res.status(501).send('Hi! I\'m not implemented yet. I\'m in ' + utils.getCodeLocation(-11) + '.');
  }

  featuresCol.find(query).limit(500).toArray().then(function(features) {
    res.json({
      type: 'FeatureCollection',
      features: features
    });
  }).catch(next);
});

module.exports = router;
