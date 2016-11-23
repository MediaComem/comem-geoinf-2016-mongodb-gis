var app = require('../app'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {

  var featuresCol = app.db.collection('features');

  var query = {};
  try {
    query = JSON.parse(req.query.find);
  } catch(err) {
    console.warn('Invalid find query: ' + err.message);
  }

  featuresCol.find(query).limit(100).toArray().then(function(features) {
    res.json({
      type: 'FeatureCollection',
      features: features
    });
  }).catch(next);
});

module.exports = router;
