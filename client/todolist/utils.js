'use strict';

var stringify = require('json-stringify-safe');

// global functions
if (typeof Function.prototype.partial != "function") {
  Function.prototype.partial = function () {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function () {
      var idx = 0, new_args = [];
      for (var i = 0, len = args.length; i < len; i++) {

        new_args[i] = args[i] === undefined ? arguments[idx++] : args[i];
      }
      return fn.apply(this, new_args);
    }
  };
}

var wrapper = function(standard, fallback) {
  return function (el, event_name, listener, use_capture) {

    if (typeof event_name == 'string') eventlisten(standard, fallback, el, event_name, listener, use_capture);
    if (exports.isArray(event_name)) {
      for(var i = 0, len = event_name.length; i < len; i++) {
        eventlisten(standard, fallback, el, event_name[i], listener, use_capture);
      }
    }
  }
};

var eventlisten = function(standard, fallback, el, event_name, listener, use_capture) {
  if (el[standard]) {
    el[standard](event_name, listener, use_capture);
  } else if (el[fallback]) {
    el[fallback]('on' + event_name, listener)
  }
};

exports.onevent = wrapper('addEventListener', 'attachEvent');

exports.offevent = wrapper('removeEventListener', 'detachEvent');

exports.isArray = function(arr) {
  if (typeof Array.isArray == 'function') return Array.isArray(arr);
  return Object.prototype.toString.call(arr) === '[object Array]';
};

exports.tmpl = function(str, data) {
  var fn =   new Function("obj",
    "var p=[],print=function(){p.push.apply(p,arguments);};" +

      // Introduce the data as local variables using with(){}
    "with(obj){p.push('" +

      // Convert the template into pure JavaScript
    str
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'")
    + "');}return p.join('');");

  return data ?
    ( typeof data.toJSON == 'function' ? fn(data.toJSON()) : fn(data) ) : fn;
};

exports.addClass = function(sel, _class) {
  manipulateClass(sel, _class);
};

exports.removeClass = function(sel, _class) {
  manipulateClass(sel, _class, true);
};

var manipulateClass = function(sel, _class, remove) {
  var elements = [];
  var classes = _class.replace(/\s+/g, ' ').split(' ');
  var classNames;
  var el;

  if (typeof sel == 'string') {
    elements = elements.concat(document.querySelectorAll(sel));
  }
  if (typeof sel.className == 'string') elements.push(sel);

  for(var i = 0, len = elements.length; i < len; i++) {
    el = elements[i];
    classNames = el
      .className
      .replace(/\s+/g, ' ')
      .split(' ');

    if (!remove) classNames = classNames.concat(classes);
    classNames = classNames
      .reduce(function(p, c) {
        var arr = remove ? classes : p;
        if (arr.indexOf(c) < 0) p.push(c);
        return p;
      }, [])
      .join(' ');

    el.className = classNames;
  }
};

exports.contain = function(parent, child) {
  if (parent === child) return true;
  return exports.isDescendant(parent, child);
};

exports.isDescendant = function(parent, child) {
  var node = child.parentNode;
  while(node != null) {
    if (node === parent) return true;
    node = node.parentNode;
  }
  return false;
};

exports.preventDefault = function(event) {
  if (typeof event.preventDefault == 'function') return event.preventDefault();
  event.returnValue = false;
};

exports.stopPropagation = function(event) {
  if (typeof event.stopPropagation == 'function') return event.stopPropagation();
  event.cancelBubble = true;
};

exports.stopImmediatePropagation = function (event) {
  if (typeof event.stopImmediatePropagation == 'function') return event.stopImmediatePropagation();
  event.cancelBubble = true;
};


exports.pluralize = function(count, word) {
  return count == 1 ? word : word + 's';
};

exports.store = function(namespace, data) {
  if (arguments.length > 1) {
    return localStorage.setItem(namespace, JSON.stringify(ddata));
  }
  else {
    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }
};



var transition_detect = function(){
  var el = document.createElement('div'); // why bs create bootstrap??

  var props = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition'    : 'transitionend',
    'OTransition'      : 'oTransitionEnd otransitionend',
    'msTransition'     : 'MSTransitionEnd',
    'transition'       : 'transitionend'
  };

  for (var prop in props){
    if (el.style[prop] != undefined) {
      //return { end : props[prop]};
      return props[prop];
    }
  }

  return false;
};

exports.transitionEnd = function(){
  var res = transition_detect();
  exports.transitionEnd = function(){return res};
  return res;
};

var animation_detect = function(){
  var el = document.createElement('div');
  var props = {
    animation : 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
    OAnimation: 'oanimationend',
    MSAnimation: 'MSAnimationEnd'
  };

  for (var prop in props) {
    if (el.style[prop] != undefined){
      return props[prop];
    }
  }
  return false;
};

exports.animationEnd = function(type){
  var res = animation_detect();
  exports.animationEnd = function(type){return res};
  return res;
};

exports.isTouchDevice = function(){
  var res = (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
  exports.isTouchDevice = function () { return res};
  return res;
};