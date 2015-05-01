'use strict';

var Emitter = require('component-emitter');
var req = require('superagent');
var stringify = require('json-stringify-safe');
var extend = require('extend');

var todo = require('./todo');

exports.create = function() {
  return new TodoList();
};

function TodoList() {
  this._todos = [];
  this._onTodoDestroyed = onTodoDestroyed.bind(this);
  this._onTodoChanged = onTodoChanged.bind(this);
  this.url = null;
  this._ts = null;
}

Emitter(TodoList.prototype);

TodoList.prototype.load = function(url) {

  var that = this;
  if (this.url) return; // TodoList only load once

  this.url = url.slice(-1) == '/' ? url : url + '/';

  req
    .get(url)
    .accept('json')
    .end(function(err, res) {
      if (res.ok) {
        if (typeof res.body.length != 'number' || res.body.length < 0) return that.emit('error', new EvalError('data malformed: ' + stringify(res.body)));

        var _todo, data;
        try {
          for(var i = 0, len = res.body.length; i < len; i++) {
            data = extend(res.body[i], {state: 'saved'});
            _todo = todo.create(url, data);
            _todo.on('destroyed', that._onTodoDestroyed);
            _todo.on('changed', that._onTodoChanged);

            that._todos.push(_todo);
          }
        } catch (err) {
          return that.emit('error', err)
        }
        that.sort();
        return that.emit('loaded', that);
      }

      if (err) return that.emit('error', err);
      that.emit('error', res);
    });
};

TodoList.prototype.sequence = function() {
  if (this._todos.length == 0) return 0;
  return this._todos[this._todos.length - 1].seq + 1;
};

TodoList.prototype.each = function (iterator) {
  var todos = this._todos;
  for(var i = 0, len = todos.length; i < len; i++) {
    iterator(todos[i]);
  }
};

TodoList.prototype.add = function(data) {

  var _todo;
  if (!data || typeof data != 'object') return this.emit('error', new TypeError('Invalid data: ' + stringify(data)));

  data.seq = this.sequence();
  _todo = todo.create(this.url, data);
  this._todos.push(_todo);
  _todo.on('destroyed', this._onTodoDestroyed);
  _todo.on('changed', this._onTodoChanged);
  this.emit('added', _todo);
  _todo.save();
};

TodoList.prototype.del = function (todo) {
  todo.destroy();
};

TodoList.prototype.delAll = function () {
  var todos = this._todos;
  for(var i = 0, len = this._todos.length; i < len; i++) {
    todos[i].destroy();
  }
};

TodoList.prototype.sort = function () {
  this._todos.sort(function (a, b) {
    return a.seq - b.seq;
  });
};

TodoList.prototype.move = function (old_index, new_index) {
  var _todo;
  var right_shift;
  var todos = this._todos;
  var len = todos.length;
  var changeds = [];
  var i, j;
  var seq_new, seq_pre, seq_tmp;

  old_index = old_index < 0 ? 0 : old_index >= len ? len - 1 : old_index;
  new_index = new_index < 0 ? 0 : new_index >= len ? len - 1 : new_index;
  right_shift = old_index < new_index;
  seq_new = todos[new_index].seq;

  for (i = 0; i < len; i++) {

    if (i < old_index && i < new_index || i > old_index && i > new_index) continue;

    _todo = todos[i];
    j = i;

    if (i == old_index) {
      if (right_shift) seq_pre = _todo.seq;
      _todo.update({seq: seq_new });
      changeds.push(_todo);
      continue;
    }

    if (right_shift) {
      seq_tmp = _todo.seq;
      _todo.update({seq: seq_pre});
      seq_pre = seq_tmp;
      changeds.push(_todo);
      continue;
    }

    _todo.update({seq: todos[++j].seq});
    changeds.push(_todo);
  }

  this.sort();
  this.update('seq', changeds);
};

TodoList.prototype.update = function(prop, changeds) {

  var that = this;
  var url = this.url + prop;

  this._ts = new Date().getTime();

  req
    .put(url)
    .accept('json')
    .send(changeds.map(function (todo) {
      return todo.uuid ? {uuid: todo.uuid, seq: todo.seq} : false;
    }).filter(Boolean))
    .query({_ts: this._ts})
    .end(function(err, res) {
      var success = {state: 'saved', warning: null};
      var failed = {state: 'unsaved', warning: 'unsaved'};

      if ( res && res.body && (!res.body._ts || res.body._ts < that._ts) ) return;

      if (err) {
        changeds.forEach(function (todo) {
          todo.update(failed);
        });
        return;
      }

      changeds.forEach(function (todo) {
        todo.update(success);
      });
    });
};

TodoList.prototype.done = function () {
  return this._todos.filter(function(todo) {
    return !!todo.done;
  });
};

TodoList.prototype.remaining = function () {
  return this._todos.filter(function(todo) {
    return !todo.done;
  });
};

TodoList.prototype.length = function () {
  return this._todos.length;
};

TodoList.prototype.toJSON = function () {
  return this._todos;
};

var onTodoDestroyed = function(todo) {

  this._todos = this._todos.filter(function(_todo) {
    return _todo !== todo;
  });
  this.emit('deleted', todo);
};

var onTodoChanged = function (changed) {
  this.emit('changed', changed);
};