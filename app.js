var path = require('path'),
    join = path.join;

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dhs = require('domain-http-server');
var swig = require('swig');
var cors = require('cors');

var routes = require('./routes');
var app = express();
var public_dir = app.get('env') == 'production' ? join(__dirname, 'dist', 'public') : join(__dirname, 'public');
var view_dir = app.get('env') == 'production' ? join(__dirname, 'dist', 'views') : join(__dirname, 'views');

// app setup
app.disable('etag');
app.set('views', view_dir);
app.set('view engine', 'swig');

if (app.get('env') != 'production') {
  app.set('view cache', false);
  swig.setDefaults({cache: false});
  app.use(cors());
}

app.use(dhs);
app.use(favicon(__dirname + '/public/img/dj.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(public_dir));
app.use(function(req, res, next) {
  res.set({
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
    "Expires": "Thu, 15 Apr 2000 20:00:00 GMT",
    "Pragma" : "no-cache"
  });
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    code: res.statusCode,
    message: err.message,
    error: app.get('env') == 'production' ? {} : err
  });
});


module.exports = app;
