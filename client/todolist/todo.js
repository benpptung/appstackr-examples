'use strict';

var Emitter = require('component-emitter');
var stringify = require('json-stringify-safe');
var req = require('superagent');

exports.create = function(url, data) {
  return new Todo(url, data);
};

exports.states = ['unsaved', 'saving', 'saved'];

function Todo(url, data) {

  if (typeof url != 'string') throw new TypeError('invalid url: ' + stringify(url));
  data = data && typeof data == 'object' ? data : {};

  this.url = url.slice(-1) != '/' ? url + '/' : url;

  // server data
  this.uuid = typeof data.uuid == 'string' ? data.uuid : null;
  this.seq = typeof data.seq == 'number' && isFinite(data.seq) ? parseInt(data.seq, 10) : Infinity;
  this.title = typeof data.title == 'string' ? data.title : '';
  this.done = typeof data.done == 'boolean' ? data.done : false;

  // run time variables
  this.state = ~exports.states.indexOf(data.state) ? data.state : 'unsaved';
  this.warning = null;

  this._ts = null;
  this._saving_timer = null;
  this.on('changed', this.save.bind(this));
}

Emitter(Todo.prototype);

Todo.prototype.teardown = function () {
  this.emit('destroyed', this);
  this.off();
};

Todo.prototype.destroy = function() {
  if (this.uuid) req.del(this.url + this.uuid).end();
  this.teardown();
};

Todo.prototype.save = function(changed) {

  if (this.state != 'unsaved') return;
  if (this.warning) return;
  if (changed && ~changed.changes.indexOf('seq')) return; // dedicate seq change to todolist

  var that = this;
  var url = this.url;
  if (this.uuid) url = url + this.uuid;

  clearTimeout(this._saving_timer);
  this._saving_timer = setTimeout(function () {

    that.update({state: 'saving', warning: null});
    that._ts = new Date().getTime();

    req
      .post(url)
      .send(that)
      .query({_ts: that._ts})
      .end(function(err, res) {
        var success = {state: 'saved', warning: null};
        var failed = {state: 'unsaved', warning: 'unsaved'};

        if (!res.body._ts || res.body._ts < that._ts) return; // lately arrival response

        if (err) {
          that.update(failed);
          return;
        }

        if (res.body.uuid) success.uuid = res.body.uuid;
        that.update(success);
      });
  }, 100);
};

Todo.prototype.update = function(data) {

  var changed = [];

  /// the data required by server
  if (typeof data.seq == 'number' && isFinite(data.seq) && this.seq != data.seq) {
    this.seq = data.seq;
    this.state = 'unsaved';
    changed.push('seq', 'state');
  }

  if (typeof data.title == 'string' && this.title != data.title) {
    this.title = data.title;
    this.state = 'unsaved';
    changed.push('title', 'state');
  }

  if (typeof data.done == 'boolean' && this.done !== data.done) {
    this.done = data.done;
    this.state = 'unsaved';
    changed.push('done', 'state');
  }

  /// assigned by server
  if (typeof data.uuid == 'string' && !this.uuid) {
    this.uuid = data.uuid;
    changed.push('uuid');
  }

  /// run time variables
  if (typeof data.warning != 'undefined' && this.warning != data.warning) {
    this.warning = data.warning;
    changed.push('warning');
  }

  if (~exports.states.indexOf(data.state) && this.state != data.state) {
    this.state = data.state;
    changed.push('state');
  }

  changed = changed.reduce(function(p, c) {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);

  if (changed.length > 0) {
    this.emit('changed', {
      changes: changed,
      todo: this
    });
  }

  return this;
};

Todo.prototype.toggle = function() {
  this.update({done: !this.done});
};

Todo.prototype.toJSON = function() {
  return {
    uuid: this.uuid,
    seq: this.seq,
    title: this.title,
    done: this.done,
    state: this.state,
    warning: this.warning
  }
};