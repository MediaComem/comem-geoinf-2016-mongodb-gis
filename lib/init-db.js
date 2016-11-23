var app = require('../app'),
    debug = require('debug')('comem-geoinf-2016-nosql-gis:db'),
    MongoClient = require('mongodb').MongoClient;

module.exports = function() {
  return MongoClient
    .connect(getDatabaseUri())
    .then(onConnected)
    .then(createGeoIndex);
};

function getDatabaseUri() {
  return process.env.DATABASE_URL || 'mongodb://localhost:27017/comem-geoinf-2016-nosql-gis';
}

function onConnected(db) {
  app.db = db;
  debug('Connected to database');
}

function createGeoIndex() {
  return app.db.collection('features').ensureIndex({
    geometry: '2dsphere'
  });
}
