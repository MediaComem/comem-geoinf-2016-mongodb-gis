var _ = require('lodash'),
    app = require('../../app'),
    express = require('express'),
    router = express.Router(),
    utils = require('../../lib/api');

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
    return res.status(501).send('Hi! I\'m not implemented yet. I\'m in ' + utils.getCodeLocation(-14) + '.');
  }

  featuresCol.find(query).limit(500).toArray().then(function(features) {
    res.json({
      type: 'FeatureCollection',
      features: features
    });
  }).catch(next);
});

module.exports = router;
