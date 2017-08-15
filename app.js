// Dependencies.
var _ = require('lodash'),
    bodyParser = require('body-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    glob = require('glob'),
    logger = require('morgan'),
    path = require('path'),
    Promise = require('bluebird');

// Server initialization functions.
var initDb = require('./lib/init-db'),
    loadData = require('./lib/load-data');

var app = express();

// Use Pug for views.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Log requests to the application.
app.use(logger('dev'));

// Parse request body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use Stylus for stylesheets.
app.use(require('stylus').middleware(path.join(__dirname, 'public')));

// Serve static files in /public
app.use(express.static(path.join(__dirname, 'public')));

// Retrieve the list of JavaScript files in ./routes/api
var apiDir = path.join(__dirname, 'routes', 'api'),
    apiFiles = glob.sync('**/*.js', {
      cwd: apiDir
    });

// Dynamically load the API routes defined in the files.
_.each(apiFiles, function(file) {
  app.use('/api', require(path.join(apiDir, file)));
})

// Load the view routes.
app.use('/', require('./routes/views'));

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler.
app.use(function(err, req, res, next) {

  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page.
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Initializes the application asynchronously.
 *
 * @returns Promise
 */
app.start = function() {
  return Promise
    .resolve()
    .then(initDb)
    .then(loadData);
};

module.exports = app;
