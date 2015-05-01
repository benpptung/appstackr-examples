'use strict';

var router = require('express').Router();
var uuid = require('uuid').v1;
var extend = require('extend');

var todolist = [];

router.get('/', function(req, res) {
  res.format({
    'text/html': function() {
      res.render('examples/todolist', {
        title: 'Todolist Demo',
        subtitle: 'No jQuery, Ractive, React or Template Engine'
      });
    },

    'application/json': function() {
      var _todolist = todolist.slice();
      _todolist._ts = req.query._ts;
      res.json(_todolist);
    }
  });
});

router.put('/seq', function(req, res) {
  var changeds = req.body;
  changeds.forEach(function(change) {
    todolist.some(function(todo) {
      if (todo.uuid === change.uuid) {
        todo.seq = change.seq;
        return true;
      }
    })
  });

  res.send({_ts: req.query._ts});
});

router.post('/', function(req, res) {
  var todo = Todo(req.body);
  todolist.push(todo);
  res.json({uuid: todo.uuid, _ts: req.query._ts});
});

router.post('/:todoUuid', function(req, res) {
  todolist.some(function(todo) {
    if (todo.uuid === req.params.todoUuid) {
      extend(todo, {
        title: req.body.title,
        done: req.body.done,
        seq: req.body.seq
      });
      return true;
    }
  });

  res.send({_ts: req.query._ts});
});

router.delete('/:todoUuid', function(req, res) {

  todolist.some(function(todo, index) {
    if (todo.uuid === req.params.todoUuid) {
      todolist.splice(index, 1);
      return true;
    }
  });

  res.send({_ts: req.query._ts});
});


module.exports = router;

var Todo = function(todo) {
  return {
    uuid: uuid(),
    title: todo.title,
    done: todo.done,
    seq: todo.seq
  }
};