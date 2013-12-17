var Canvas    = require('canvas-browserify')
var Vec2      = require('vec2')
var vecCanvas = require('./vec2-canvas')

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

var graph = module.exports = function (table, opts) {
  opts = opts || {}
  var canvas = CANVAS = Canvas()
  canvas.width = opts.width || 300
  canvas.height = opts.height || 150
  var ctx = CTX = canvas.getContext('2d')

  table.sort()

  var colours = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple']

  //this will be synchronous, because table is an array.

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
    stat.colour = ctx.strokeStyle = colours[i]

    console.log(table.header(i))

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

  function round (n) {
    return parseFloat(n.toPrecision(opts.precision || 3))
  }

  console.log('scales', axis, scales)

  var draw =
    vecCanvas(ctx)

  var j = 0

  //draw scale on the sides of the graph
  //drawing the actual graph is the easy bit.
  //but it's the scales that make it useful.
  function drawScale (scale, log) {
    var opts = scale.side
    var min = opts.min, max = opts.max, align = opts.align
    draw.strokeStyle('black').fillStyle('black').start().move(min).line(max)
    
    function toScale (value) {
      return log ? Math.pow(Math.E, value) : value
    }

    var textWidth = ctx.measureText(round(toScale(stat.max))).width
    var textSize = align.x ? textHeight : textWidth

    var room   = v(max).subtract(min).length()
    var vec    = v(max).subtract(min).normalize()
    var offset = v(align).multiply((align.x > 0 ? textHeight : textHeight*1.5))
    var dash   = v(align).multiply(5)

    //how many marks can fit on the graph?
    //if it's linear, that is simple
    //if it's logarithmic, that is a little more complex.
    //for now, we only support powers of 10 on the scale.
    var xScale = room/(scale.max - scale.min)
    //figure out step size for linear axis
    var _step = !log ? (function () {
      var i = 0, e
      while(true) {
        var e = Math.pow(10, i++)
        if(room   / (scale.range / e) > textWidth*3) return e
        if(room*2 / (scale.range / e) > textWidth*3) return e*2
        if(room*5 / (scale.range / e) > textWidth*3) return e*5
      }
    })() : 1

    function step (i) {
      return !log ? _step * i 
      : (Math.log(Math.pow(Math.E, round(stat.min)) * Math.pow(Math.pow(10, 1), i)) - scale.min)
    }

    var marks = Math.floor(scale.range/_step)

    var markV = v(), textV = v()
    for(var i = 0; i <= marks; i++) {
      var value = step(i)
      markV.set(vec).multiply(value*xScale).add(min)

      draw
        .textAlign('center')
        .text(
          round(toScale(scale.min + value)),
          textV.set(markV).add(offset),
          {rotate: !!align.x} //90 degrees
        )
        .move(markV)
        .line(markV.add(dash))
    }

    //move this to after drawing the graphs...

    var label = (scale.title || '') + (scale.units ? ' (' + scale.units + ')' : '')
    if(label) {
      draw.text(
        label,
        v(min).add(max).divide(2).add(v(align).multiply((align.x > 0 ? textHeight*2 : textHeight*2.5))),
        {rotate: !!align.x}
      )
    }

    draw.stroke()
  }

  function drawLabels (scale, side) {
    var opts = side || scale.side
    var min = opts.min, max = opts.max, align = opts.align
    var onSide = stats.filter(function (stat) {
      return stat.units === scale.units
    })

    var length = 0
    var labels = onSide.map(function (e) {
      var label = e.title
      length += ctx.measureText(label).width + 15
      return label
    })

    length += (onSide.length )*5 + ctx.measureText('('+scale.units+')').width

    var dir = v(max).subtract(min).normalize()//.multiply(-1)
    var center =
      v(min).add(max).divide(2)
      .add(v(align).multiply((align.x > 0 ? textHeight*2 : textHeight*2.5)))

    var start = v(min)
      .add(v(align).multiply((align.x > 0 ? textHeight*2 : textHeight*2.5)))

    //v(center).subtract(v(dir).multiply(length/2))
    var space = v(dir).multiply(textHeight)
    var line  = v(dir).multiply(textHeight*2)
    
    draw.textAlign('left')

    labels.forEach(function (label, i) {
      var length = ctx.measureText(label).width
      console.log('label', label, onSide[i].colour, start)

      draw
        .text(label, start, {rotate: !!align.x})
  
      draw
        .start()
        .strokeStyle(onSide[i].colour)
        .move(start.add(v(dir).multiply(length)).add(space))
        .line(start.add(line))
        .stroke()

      start.add(space)

      //into position for next label
    })

    //draw.text('('+scale.units+')', start, {rotate: !!align.x})
  }

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
    drawScale(scale)
  })

  drawLabels(axis[1], sides[0])

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
  var createTable = require('dat-table').createTable
  document.body.appendChild(
    graph(createTable(require('./test/fib.json')), {width: 1000, height:600, title: 'fib generators'})
  )
}

