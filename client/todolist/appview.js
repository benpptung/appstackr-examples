'use strict';

var stringify = require('json-stringify-safe');
var insertcss = require('insert-css');
var sortable = require('sortablejs');

var utils = require('./utils'),
    tmpl = utils.tmpl,
    addClass = utils.addClass,
    removeClass = utils.removeClass,
    onevent = utils.onevent;
var styles = require('./less/todos.less');
var tmplTodos = require('./tmpl/todos.html');
var statsview = require('./views/stats');
var todoview = require('./views/todoview');

exports.create = function(model) {
  return new AppView(model);
};

function AppView(model) {

  /// states
  this.root = null;
  this.tmpl = tmpl(tmplTodos);
  this._cssInserted = false;

  // key nodes
  this.input = null;
  this.toggleAll = null;
  this.footer = null;
  this.main = null;
  this.list = null;
  this._sortable = null;

  // models
  this.todolist = model.todolist;
  this.url = model.url;
  this.todoviews = [];

  // listeners
  this._updateRemaining = updateRemaining.bind(this);
  this._updateView = updateView.bind(this);
  this._hideListView = hideListView.bind(this);
  this._addTodoView = addTodoView.bind(this);
  this._addTodo = addTodo.bind(this);
  this._toggleAllCompleted = toggleAllCompleted.bind(this);
  this._onSortableUpdate = onSortableUpdate.bind(this);
}

AppView.prototype.mount = function (sel) {
  if (this.root) return;

  if (typeof sel == 'string') this.root = document.querySelector(sel);
  if (typeof sel.querySelector == 'function') this.root = sel;
  if (!this.root) return;

  var that = this;
  var todolist = this.todolist;
  var root = this.root;
  var todoviews = this.todoviews;

  todolist
    .on('loaded', this._updateView)
    .on('added', this._updateView)
    .on('changed', this._updateRemaining)
    .on('deleted', this._updateRemaining)
    .on('added', this._addTodoView);

  todolist.on('loaded', function() {
    var todos = todolist.toJSON();
    var todo;
    var _todoview;
    for( var i = 0, len = todos.length; i < len; i++) {
      todo = todos[i];
      _todoview = todoview(todo).mount(that.list);
      _todoview.on('destroyed', that._hideListView);
      todoviews.push(_todoview);
    }
  });

  onevent(root, 'keypress', this._addTodo);
  onevent(root, 'click', this._toggleAllCompleted);

  this.render();
  statsview(todolist).mount(this.footer);
  todolist.load(this.url);
};

AppView.prototype.render = function () {

  var root = this.root;

  if (!this._cssInserted) {
    insertcss(styles);
    this._cssInserted = true;
  }

  if (this._sortable) {
    this._sortable.destroy();
    this._sortable = null;
  }

  this.root.innerHTML = this.tmpl({});
  this.input = root.querySelector('.new-todo');
  this.toggleAll = root.querySelector('.toggle-all');
  this.footer = root.querySelector('footer');
  this.main = root.querySelector('.main');
  this.list = root.querySelector('.todo-list');

  this._sortable = sortable.create(this.list, {
    filter: '.toggle, .pencil, .destroy',
    onFilter: function() {
      throw new Error('throw the Error is the fastest way to FIX sortable bug on touch device!');
    },
    onUpdate: this._onSortableUpdate
  });
};

var addTodo = function (e) {

  var target = e.target || e.srcElement;
  if (!utils.contain(this.input, target)) return;
  utils.stopPropagation(e);

  if (!this.input.value) return;
  var code = e.keyCode || e.which;
  if (code != 13 && e.key != 'Enter') return;

  this.todolist.add({
    title: this.input.value
  });
  this.input.value = '';
};

var addTodoView = function (todo) {
  var _todoview = todoview(todo).mount(this.list);
  _todoview.on('destroyed', this._hideListView);
  this.todoviews.push(_todoview);
};

var toggleAllCompleted = function (e) {

  var target = e.target || e.srcElement;
  if (!utils.contain(this.toggleAll, target)) return;
  utils.stopPropagation(e);

  var done = this.toggleAll.checked;

  this.todolist.each(function (todo) {
    todo.update({done: done});
  })
};

var updateRemaining = function () {
  var remaining = this.todolist.remaining().length;
  this.toggleAll.checked = !remaining;
};

var updateView = function () {
  if (this.todolist.length()) addClass(this.main, 'show') ;
  updateRemaining.call(this);
};

var hideListView = function (todoview) {
  var main = this.main;
  var todolist = this.todolist;
  this.todoviews = this.todoviews.filter(function(view) {
    return view !== todoview;
  });


  if (!todolist.length() && this.todoviews.length == 0 ) {
    removeClass(main, 'show');
  }
};

var onSortableUpdate = function (e) {
  this.todolist.move(e.oldIndex, e.newIndex);
};