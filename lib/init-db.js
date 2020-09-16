var app = require('../app'),
    debug = require('debug')('mongodb-gis:db'),
    MongoClient = require('mongodb').MongoClient;

module.exports = function() {
  return MongoClient
    .connect(getDatabaseUri(), { useUnifiedTopology: true })
    .then(onConnected)
    .then(createGeoIndex);
};

function getDatabaseUri() {
  return process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/mongodb-gis';
}

function onConnected(client) {
  app.db = client.db();
  debug('Connected to database');
}

function createGeoIndex() {
  return app.db.collection('features').createIndexes({
    geometry: '2dsphere'
  });
}
