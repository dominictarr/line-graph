#! /usr/bin/env electro
var opts = require('optimist').argv
var graph = require('./')

var canvas = document.createElement('canvas')

document.body.appendChild(canvas)

if (opts.size) {
  canvas.width = opts.size.split('x').shift()
  canvas.height = opts.size.split('x').pop()
}
else {
  canvas.width = opts.width || 300
  canvas.height = opts.height || 150
}

var data = ''
var Table = require('dat-table')
process.stdin.on('data', function (d) {
  data += d
})
.on('end', function () {
  var table
  if(/^\s*[[{]/.test(data))
    table = Table.createTable(JSON.parse(data))
  else
    table = Table.createTable(data)

  graph(canvas.getContext('2d'), table, opts)

  if(!process.stdout.isTTY) {
    var out = canvas.toDataURL('image/png')
    var i = out.indexOf(',')
    process.stdout.write(new Buffer(out.substring(i), 'base64'))
    window.close()
  }
})
