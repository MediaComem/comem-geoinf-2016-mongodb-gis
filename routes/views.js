var _ = require('lodash'),
    express = require('express'),
    glob = require('glob'),
    path = require('path'),
    router = express.Router();

var root = path.join(__dirname, '..');

var exerciseFiles = glob.sync('**/*.js', {
  cwd: path.join(root, 'public', 'javascripts', 'exercises')
});

router.get('/', function(req, res, next) {
  res.render('index', {
    exercises: exerciseFiles
  });
});

module.exports = router;
