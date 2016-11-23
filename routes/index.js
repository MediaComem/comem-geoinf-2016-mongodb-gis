var _ = require('lodash'),
    express = require('express'),
    glob = require('glob'),
    path = require('path'),
    router = express.Router();

var root = path.join(__dirname, '..');

var exerciseFiles = glob.sync('**/*.js', { cwd: path.join(root, 'public', 'javascripts', 'exercises') });

var templateNames = _.map(glob.sync('**/*.pug', { cwd: path.join(__dirname, '..', 'views', 'templates') }), function(filename) {
  return filename.replace(/\.pug$/, '');
});

router.get('/', function(req, res, next) {
  res.render('index', {
    exercises: exerciseFiles
  });
});

router.get('/templates/:name', function(req, res, next) {

  var filename = req.params.name;
  if (!filename || !filename.match(/^\w+(?:-\w+)*\.html$/)) {
    return res.sendStatus(404);
  }

  var templateName = filename.replace(/\.html$/, '');
  if (!_.includes(templateNames, templateName)) {
    return res.sendStatus(404);
  }

  res.render('templates/' + templateName.replace(/\.html$/, ''));
});

module.exports = router;
