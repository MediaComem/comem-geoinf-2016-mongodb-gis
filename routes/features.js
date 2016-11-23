var _ = require('lodash'),
    app = require('../app'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {

  var featuresCol = app.db.collection('features');

  var query = {};

  if (_.isString(req.query.geometryType)) {
    query['geometry.type'] = req.query.geometryType;
  }

  featuresCol.find(query).limit(100).toArray().then(function(features) {
    res.json({
      type: 'FeatureCollection',
      features: features
    });
  }).catch(next);
});

module.exports = router;
