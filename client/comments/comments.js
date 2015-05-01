'use strict';

var ractive = require('ractive');
var marked = require('marked');

var widget = require('./views/widget.ract');
var widgetCSS = require('./views/widget.scss');
var comment = require('./views/comment.ract');
var commentCSS = require('./views/comment.scss');

exports.mount = function(el, data) {
  return exports.CommentWidget({
    el: el,
    data: data
  });
};

exports.Comment = ractive.extend({
  template: comment,
  css: commentCSS,
  data: {
    marked: marked
  },
  transitionsEnabled: false
});

exports.CommentWidget = ractive.extend({

  transitionsEnabled: false,
  template: widget,
  css: widgetCSS,
  components: {
    'Comment': exports.Comment
  },
  post: function(event, comment) {
    // prevent the page from reloading
    event.original.preventDefault();

    // add to the list of comments
    comment.isNew = true;
    this.push('comments', comment);

    // fire an event, so we can ( for example )
    // save the comment to our server
    this.fire('newComment', comment);

    // reset the form
    document.activeElement.blur();
    this.set({ author: '', text: ''})
  }

});