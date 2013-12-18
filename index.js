var Canvas    = require('canvas-browserify')
var Vec2      = require('vec2')
var vecCanvas = require('./vec2-canvas')
var drawScale     = require('./scale')
var ruler     = require('./ruler')
var drawLabels    = require('./labels')
var TAU = 2*Math.PI

function v (x, y) {
  return new Vec2(x, y)
}

function find (ary, test) {
  for(var i in ary)
    if(test(ary[i], i, ary))
      return ary[i]
}

/*
now, we can only support 2 scales, maximum.
(to be drawn on the left and the right side)
*/

function nColours (N, sat, light) {
  sat = sat || 100; light = light || 50
  var a = []
  for(var i = 0; i < N; i++) {
    console.log(i, 360/N)
    a.push('hsl('+ (i*(360/N)) + ', ' + sat + '%, ' + light +'%)')
  }
  return a
}

var graph = module.exports = function (canvas, table, opts) {
  var ctx = canvas.getContext('2d')
  opts = opts || {}
  table.sort()

  var colours = nColours(table.width() - 1, 100, 50)

  var stats = table.stats()
  //calculate margin from font height
  var textHeight = parseInt(CTX.font)
  var margin = textHeight * 3

  var scales = {}, axis = []

  function defaultTo (n, v) {
    return n == null ? v : n
  }

  stats.forEach(function (stat, i) {
    if(!stat) return
    stat.min = 0
    stat.range = stat.max
    stat.title = table.header(i).name
    stat.units = table.header(i).units
    stat.color =
    stat.colour = colours[i - 1]

    if(i !== 0) {
      var scale = scales[stat.units] || {}
      scale.units = stat.units
      scale.min = Math.min(stat.min, defaultTo(scale.min,  Infinity))
      scale.max = Math.max(stat.max, defaultTo(scale.max, -Infinity))
      scale.range = scale.max - scale.min
      scales[scale.units] = scale
    }
  })

  axis[0] = stats[0]

  for(var u in scales)
    axis.push(scales[u])

  var stat = stats[0]
  var xScale = (canvas.width - margin*2) / (stat.max - stat.min)
  var xMin = stat.min

  var draw = vecCanvas(ctx)

  var j = 0

  //draw scale on the sides of the graph
  //drawing the actual graph is the easy bit.
  //but it's the scales that make it useful.

  var sides = [
    //bottom
    { min   : v(margin, canvas.height - margin),
      max   : v(canvas.width - margin, canvas.height - margin),
      align : v(0, 1)
    },
    //left
    { min   : v(margin, canvas.height - margin),
      max   : v(margin, margin),
      align : v(-1, 0)
    },
    //right
    { min   : v(canvas.width - margin, canvas.height - margin),
      max   : v(canvas.width - margin, margin),
      align : v(1, 0)
    }
  ]

  axis.forEach(function (scale, i) {
    scale.side = sides[i]
//    drawScale(canvas.getContext('2d'), scale)
    ctx.save()
    //bottom or left axis stat at bottom left
    if(i <= 1)
      ctx.translate(margin, canvas.height - margin)
    //3rd axis starts at bottom right
    else
      ctx.translate(canvas.width - margin, canvas.height - margin)

    console.log(i, TAU*-0.25)
    if(i)
      ctx.rotate(TAU*-0.25)

    ruler(ctx, (i ? canvas.height : canvas.width) - margin*2, i==1 ? TAU/2 : 0, scale.min, scale.max)
    ctx.restore()
  })

  drawLabels(ctx, axis[1], stats, sides[0])

  stats.forEach(function (stat, col) {
    if(!col) return
    var scale = scales[stat.units]

    if(!stat) return
    var yScale = (canvas.height - margin*2)/(scale.max - scale.min)
    var _x = 0, _y = 0
    ctx.beginPath()
    ctx.strokeStyle = stat.color
    table.forEach(function (row, n) {
      var value = row[col]
      if(isNaN(value)) return
      var y = margin + (value - stat.min)*yScale
      var x = margin + (row[0] - xMin)*xScale
      ;(n ? ctx.lineTo : ctx.moveTo).call(ctx, x, canvas.height - y)
    })
    ctx.stroke()
  })

  draw
    .fillStyle('black')
    .text(opts.title || "Graph o'Data", {x: canvas.width/2, y: textHeight * 2})
  
  return canvas
}

if(process.title === 'browser') {
  var canvas = CANVAS = Canvas()
  canvas.width = 1000
  canvas.height = 600
  var ctx = CTX = canvas.getContext('2d')
  var createTable = require('dat-table').createTable
  graph(canvas, createTable(require('./test/fib.json')), {title: 'fib generators'})
  document.body.appendChild(canvas)
}
