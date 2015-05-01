'use strict';

var view = require('./appview');
var todolist = require('./todolist');
view
  .create({
    url: '/examples/todolist/',
    todolist: todolist.create()
  })
  .mount('#todolist-demo');