var Canvas = require('canvas-browserify')

var graph = require('./')

if(process.title === 'browser') {
  var createTable = require('dat-table').createTable

  var canvas = Canvas()
  canvas.width = 1000
  canvas.height = 600
  var ctx = CTX = canvas.getContext('2d')
  graph(ctx, createTable(require('./test/fib.json')), {title: 'fib generators'})
  document.body.appendChild(canvas)

  var canvas = Canvas()
  canvas.width = 1000
  canvas.height = 600
  var ctx = canvas.getContext('2d')
  graph(ctx, createTable(require('./test/merkle.json')), {title: 'Time to build a merkle tree'})
  document.body.appendChild(canvas)
}

