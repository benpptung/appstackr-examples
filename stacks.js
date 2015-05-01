'use strict';

module.exports = [
  {
    name: 'base/site',
    nature: 'css',
    files: [
      // core styles
      'client/site/style.scss',
      'node_modules/animate.css/source/_base.css',
      'node_modules/animate.css/source/attention_seekers/*.css',
      'node_modules/animate.css/source/fading_entrances/*.css',
      'node_modules/animate.css/source/specials/hinge.css'
    ],
    watch: 'client/site/**/*.*, client/navbar/**/*.scss'
  },
  {
    name: 'base/site',
    nature: 'js',
    files: [
      // core modules
      'client/site/index.js',
      'superagent',
      'node_modules/ractive/ractive-legacy.runtime.min.js',
      'ractive-events-tap/ractive-events-tap.min.js',
      'node_modules/react/dist/react.min.js'
    ],
    browserify: {
      exposes: 'ractive-legacy.runtime.min.js:ractive, superagent, react.min.js:react',
      noParse: ['node_modules/react/dist/react.min.js']
    }
  },
  {
    name: 'base/iefix',
    nature: 'js',
    files: [
      'node_modules/html5shiv/dist/html5shiv.min.js',
      'node_modules/respond.js/dest/respond.matchmedia.addListener.min.js',
      'ie8'
    ]
  },
  {
    name: 'examples',
    nature: 'js',
    files: [
      'client/comments/index.js',
      'client/todolist/index.js',
      'client/react-todolist/index.jsx'
    ],
    watch: [
      'client/comments/**/*.*',
      'client/todolist/**/*.*'
    ],
    browserify: {
      externals: 'ractive, react'
    }
  }
];