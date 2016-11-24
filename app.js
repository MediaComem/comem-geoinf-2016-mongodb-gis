var _ = require('lodash'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    glob = require('glob'),
    logger = require('morgan'),
    path = require('path'),
    Promise = require('bluebird');

var initDb = require('./lib/init-db'),
    loadData = require('./lib/load-data');

var views = require('./routes/views');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var apiDir = path.join(__dirname, 'routes', 'api'),
    apiFiles = glob.sync('**/*.js', {
      cwd: apiDir
    });

_.each(apiFiles, function(file) {
  app.use('/api', require(path.join(apiDir, file)));
})

app.use('/', views);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.start = function() {
  return Promise
    .resolve()
    .then(initDb)
    .then(loadData);
};

module.exports = app;
