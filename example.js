var canvas = document.createElement('canvas')


var graph = require('./')

if(process.title !== 'node') {
  var createTable = require('dat-table').createTable
  window.LineGraph = function (data, opts) {
    document.body.innerHTML = ''
    canvas.width = opts.width || 1000
    canvas.height = opts.height || 600

    var ctx = CTX = canvas.getContext('2d')
    graph(ctx, createTable(data))
    document.body.appendChild(canvas)
  }

//  var canvas = Canvas()
//  canvas.width = 1000
//  canvas.height = 600
//  var ctx = CTX = canvas.getContext('2d')
//  graph(ctx, createTable(require('./test/fib.json')), {title: 'fib generators'})
//  document.body.appendChild(canvas)
//

  canvas.width = 1000
  canvas.height = 600
  var ctx = canvas.getContext('2d')
  graph(ctx, createTable(require('./test/merkle.json')), {title: 'Time to build a merkle tree'})
  document.body.appendChild(canvas)
}



