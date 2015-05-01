'use strict';

var stringify = require('json-stringify-safe');
var Emitter = require('component-emitter');

var utils = require('../utils'),
    tmpl = utils.tmpl,
    onevent = utils.onevent,
    offevent = utils.offevent,
    addClass = utils.addClass,
    removeClass = utils.removeClass;
var tmplItem = require('../tmpl/todo-item.html');

module.exports = function (model) {
  return new TodoView(model);
};

function TodoView(model) {

  this.root = null;

  var wrapper = this.wrapper = document.createElement('li');
  var className = 'list-group-item list-group-item-info animated bounce';
  if (utils.isTouchDevice()) className += ' touch-device';
  wrapper.className = className;

  this.tmpl = tmpl(tmplItem);
  this.todo = model;

  // key nodes
  this.view = null;
  this.toggle = null;
  this.removeButton = null;
  this.edit = null;

  // listeners
  this._onClick = onClick.bind(this);
  this._onKeyPress = onKeyPress.bind(this);
  this._onBlur = onBlur.bind(this);
  this._onTransitionEndRemove = onTransitionEndRemove.bind(this, utils.animationEnd());
  this._onRendered = onRendered.bind(this, utils.animationEnd());
}

Emitter(TodoView.prototype);

TodoView.prototype.mount = function (el) {
  if (this.root) return;
  if (!el.appendChild) throw new TypeError('invalid el: ', stringify(el));
  this.root = el;

  var transitionEnd = utils.animationEnd();

  onevent(this.wrapper, 'click', this._onClick);
  onevent(this.wrapper, 'keypress', this._onKeyPress);

  if (transitionEnd) {
    onevent(this.wrapper, transitionEnd, this._onRendered);
  }

  this.todo.on('changed', this.render.bind(this));
  this.todo.on('destroyed', destroy.bind(this));

  this.root.appendChild(this.wrapper);
  this.render();
  return this;
};

TodoView.prototype.render = function () {
  var wrapper = this.wrapper;

  if (this.edit) offevent(this.edit, 'blur', this._onBlur);

  /// taplize
  wrapper.innerHTML = this.tmpl(this.todo);
  this.view = wrapper.querySelector('.view');
  this.toggle = wrapper.querySelector('.toggle');
  this.pencil = wrapper.querySelector('.pencil');
  this.removeButton = wrapper.querySelector('.destroy');
  this.edit = wrapper.querySelector('.edit');

  this.todo.done ? addClass(wrapper, 'done') : removeClass(wrapper, 'done');

  onevent(this.edit, 'blur', this._onBlur);
};

var onClick = function (e) {

  var target = e.target || e.srcElement;

  if (utils.contain(this.toggle, target)) {
    utils.preventDefault(e);
    return this.todo.toggle();
  }

  if (utils.contain(this.removeButton, target)) {
    utils.preventDefault(e);
    return this.todo.destroy();
  }

  if (utils.contain(this.pencil, target)) {
    utils.preventDefault(e);
    utils.addClass(this.wrapper, 'editing');
    this.edit.focus();
  }
};

var onKeyPress = function (e) {
  var target = e.target || e.srcElement;
  if (!utils.contain(this.edit, target)) return;
  utils.stopPropagation(e);

  var code = e.keyCode || e.which;
  if (code == 13 || e.key == 'Enter') showView.call(this);
};

var onBlur = function (e) {

  var target = e.target || e.srcElement;
  if (!utils.contain(this.edit, target)) return;
  utils.stopPropagation(e);

  showView.call(this);
};

var showView = function() {
  var value = this.edit.value;

  if (!value) return this.todo.destroy();
  this.todo.update({ title: value});
  utils.removeClass(this.wrapper, 'editing');
};

var destroy = function () {
  var transitionEnd = utils.animationEnd();
  var root = this.root;
  var wrapper = this.wrapper;

  offevent(wrapper, 'click', this._onClick);
  offevent(wrapper, 'dbclick', this._onDbClick);
  offevent(wrapper, 'keypress', this._onKeyPress);
  offevent(wrapper, 'blur', this._onBlur);

  if (transitionEnd) {
    onevent(wrapper, transitionEnd, this._onTransitionEndRemove);
    addClass(wrapper, 'hinge');
    return;
  }

  root.removeChild(wrapper);
  this.emit('destroyed', this);
  this.off();
};

var onTransitionEndRemove = function (transition_end_event) {
  offevent(this.wrapper, transition_end_event, onTransitionEndRemove);
  this.root.removeChild(this.wrapper);
  this.emit('destroyed', this);
  this.off();
};

var onRendered = function (transition_end_event) {
  removeClass(this.wrapper, 'bounce');
  offevent(this.wrapper, transition_end_event, this._onRendered);
};