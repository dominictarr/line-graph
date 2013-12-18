var vec2Draw = require('./vec2-canvas')
var Vec2 = require('vec2')

function v (x, y) {
  return new Vec2(x, y)
}

function labels (ctx, stats) {
  var across = 0
  var textHeight = parseInt(ctx.font)
  for(var i in stats) {
    var stat = stats[i]
    ctx.fillText(stat.title, across, 0)
    var width = ctx.measureText(stat.title).width
    ctx.beginPath()
    ctx.moveTo(across+=textHeight+width, 0)
    ctx.strokeStyle = stat.color
    ctx.lineTo(across+=(textHeight*2), 0)
    ctx.stroke()
    across+= textHeight
  }
  return across
}

module.exports =
  function drawLabels (ctx, scale, stats, side) {
    var opts = side || scale.side
    ctx.save()
    
    var textHeight = parseInt(ctx.font)
    ctx.translate(opts.min.x, opts.min.y + textHeight * 2.5)
    var onSide = stats.filter(function (stat) {
      return stat.units === scale.units
    })
    labels(ctx, onSide)
    ctx.restore()
    return
    /*
    var draw = vec2Draw(ctx)
    var opts = side || scale.side
    var min = opts.min, max = opts.max, align = opts.align
    var textHeight = parseInt(ctx.font)
    var length = 0
    var labels = onSide.map(function (e) {
      var label = e.title
      length += ctx.measureText(label).width + 15
      return label
    })

    length += (onSide.length )*5 + ctx.measureText('('+scale.units+')').width

    var dir = v(max).subtract(min).normalize()
    var center =
      v(min).add(max).divide(2)
      .add(v(align).multiply((align.x > 0 ? textHeight*2 : textHeight*2.5)))

    var start = v(min)
      .add(v(align).multiply((align.x > 0 ? textHeight*2 : textHeight*2.5)))

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
    */
    //draw.text('('+scale.units+')', start, {rotate: !!align.x})
  }

