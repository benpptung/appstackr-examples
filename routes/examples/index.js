'use strict';

var router = require('express').Router();

var todolist = require('./todolist');

router.get('/ractive-comments', function(req, res) {
  res.render('examples/ractive-comments', {title: 'Ractive Comments'});
});

router.get('/ractive-todolist', function(req, res) {
  res.render('examples/ractive-todolist', {title: 'Ractive Todolist'});
});

router.get('/react-todolist', function(req, res) {
  res.render('examples/react-todolist', {title: 'React Todolist'});
});

router.use('/todolist', todolist);

module.exports = router;