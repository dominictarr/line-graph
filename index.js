var ruler  = require('./ruler')
var labels = require('./labels')
var Color  = require('color')
//Tau is much easier to visualize.
//rotating one quarter is Tau/4, etc
var TAU = 2*Math.PI

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
    //convert to rgb because node-canvas doesn't support hsl
    a.push(Color('hsl('+ ~~(i*(360/N)) + ', ' + sat + '%, ' + light +'%)').rgbString())
  }
  return a
}

var graph = module.exports = function (ctx, table, opts) {
  opts = opts || {}
  var width = opts.width || ctx.canvas.width
  var height = opts.height || ctx.canvas.height

  table.sort()

  var colours = nColours(table.width() - 1, 100, 50)

  var stats = table.stats()
  //calculate margin from font height
  var textHeight = parseInt(ctx.font)
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
  var xScale = (width - margin*2) / (stat.max - stat.min)
  var xMin = stat.min

  var j = 0
  axis.forEach(function (scale, i) {
    ctx.save()
      
      if(i <= 1) //bottom & left axis stat at bottom left
        ctx.translate(margin, height - margin)

      else //3rd axis starts at bottom right
        ctx.translate(width - margin, height - margin)

      if(i) ctx.rotate(TAU*-0.25)

      ruler(ctx,
        //length of side or bottom
        (i ? height : width) - margin*2,
        //flip labels on left side.
        i==1 ? TAU/2 : 0,
        scale.min,
        scale.max
      )
    ctx.restore()
  })

  function getLabels(scale) {
    return stats.filter(function (stat) {
      if(!stat) return
      return stat.units === scale.units
    })
  }

  //two axis graph, draw lables on the bottom.
  if(axis.length == 2) {
    ctx.save()
      ctx.translate(margin, (height - margin) + (textHeight * 2.5))
      labels(ctx, getLabels(axis[1]))
    ctx.restore()
  }

  //three axis graph lables on the sides
  else if(axis.length == 3) {
    ctx.save()
      ctx.translate(margin - (textHeight * 2.5), margin)
      ctx.rotate(TAU*0.25)
      labels(ctx, getLabels(axis[1]))
    ctx.restore()

    ctx.save()
      ctx.translate((width - margin) + (textHeight * 2), margin)
      ctx.rotate(TAU*0.25)
      labels(ctx, getLabels(axis[2]))
    ctx.restore()
  }

  stats.forEach(function (stat, col) {
    if(!col || !stat) return
    var scale = scales[stat.units]

    if(!stat) return
    var yScale = (height - margin*2)/(scale.max - scale.min)
    var _x = 0, _y = 0
    ctx.beginPath()
    ctx.fillStyle = ctx.strokeStyle = stat.color
    table.forEach(function (row, n) {
      var value = row[col]
      if(isNaN(value)) return
      var y = margin + (value - stat.min)*yScale
      var x = margin + (row[0] - xMin)*xScale
      if (opts.scatter) {
        ctx.fillRect(x, height - y, 2, 2)
      }
      else
        (n ? ctx.lineTo : ctx.moveTo).call(ctx, x, height - y)
    })
    ctx.stroke()
  })
  ctx.fillStyle = 'black'
  ctx.fillText(opts.title || "Graph o'Data", width/2, textHeight * 2)
}

graph.colors =
graph.colours = nColours
