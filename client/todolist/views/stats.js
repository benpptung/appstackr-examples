'use strict';

var stringify = require('json-stringify-safe');

var tmplStats = require('../tmpl/todo-stats.html');
var utils = require('../utils'),
    tmpl = utils.tmpl,
    contain = utils.contain,
    onevent = utils.onevent,
    addClass = utils.addClass,
    removeClass = utils.removeClass;

module.exports = function(model) {
  return new Stats(model);
};

function Stats(model) {

  // root
  this.root = null;
  this.tmpl = tmpl(tmplStats);
  this.todolist = model;

  // key nodes
  this.clearCompleted = null;

  // listener
  this._onClearCompleted = clearCompleted.bind(this);
  this._onTodolistChange = render.bind(this);
}

Stats.prototype.mount = function(sel) {

  if (this.root) return;
  if (typeof sel == 'string') this.root = document.querySelector(sel);
  if (typeof sel.querySelector == 'function') this.root = sel;
  if (!this.root) throw new TypeError('invalid sel: ', stringify(sel));

  var root = this.root;

  this.todolist
    .on('loaded', this._onTodolistChange)
    .on('added', this._onTodolistChange)
    .on('deleted', this._onTodolistChange)
    .on('changed', this._onTodolistChange);

  onevent(root, 'click', this._onClearCompleted);
};

var render = function () {

  var done = this.todolist.done().length;
  var remaining = this.todolist.remaining().length;
  var root = this.root;

  if (this.todolist.length()) {

    root.innerHTML = this.tmpl({done: done, remaining: remaining});
    /// listen to .clear-completed element
    this.clearCompleted = root.querySelector('.clear-completed');

    addClass(root, 'show');
  }
  else {
    removeClass(root, 'show');
  }

};

var clearCompleted = function(event) {

  var target = event.target || e.srcElement;
  if (!contain(this.clearCompleted, target)) return;
  utils.stopPropagation(event);

  this.todolist.done().forEach(function (todo) {
    todo.destroy();
  });
};