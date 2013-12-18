var vec2Draw = require('./vec2-canvas')
var Vec2 = require('vec2')

function v (x, y) {
  return new Vec2(x, y)
}

module.exports = drawScale
drawScale.steps = steps

function calcSteps (min, max, room, width) {
  var range = max - min
  var i = 0, e
  console.log('mMrw', min, max, room, width)
  while(true) {
    var e = Math.pow(10, i++)
    if(e > 10000000000)
      throw new Error('oops')
    if(room   / (range / e) > width*3) return e
    if(room*2 / (range / e) > width*3) return e*2
    if(room*5 / (range / e) > width*3) return e*5
  }
}

//must have range, room, and
function steps (min, max, opts, each) {
  var range = max - min
  var step = calcSteps(min, max, opts.room, opts.width)
  for(var i = 0; i*step < range; i++) {
    each(i*step)
  }
}

/*
A WWAAAAYYY easier approach.
draw everything straight up and starting from zero.
then translate/rotate to that point before you draw it.

you just have to remember to pop the state again...
it would be interesting if you could create independent drawing contexts,
but you can't...
*/

function ruler (ctx, length, nRotate, min, max) {
  var textHeight = parseInt(CTX.font)
  var draw = vec2Draw(ctx)
  nRotate = nRotate || 0
  draw
    .start()
    .move({x:0, y:0})
    .line({x:length, y:0})
    .stroke()

  var i = 0
  var range = max - min
  var scale = length/range
  var step = calcSteps(min, max, length, ctx.measureText(max).width)
  for(var i = 0; i < range*step; i++) {
    ctx.save()
    ctx.translate(i*step*scale, 0)
    if(nRotate)
      ctx.rotate(nRotate)
    draw
      .move({x:0, y:0})
      .line({x:0, y:textHeight/2})
      .textAlign('center')
      .text(i*step, {x:0, y: textHeight * 1.5})
      .stroke()
    ctx.restore()
  }
}
var T = 0
function drawScale (ctx, scale, opts) {
//  if(T++) return
//  ctx.save()
//  ctx.translate(Math.round(scale.side.min.x), Math.round(scale.side.min.y))
//  ruler(ctx,
//    v(scale.side.min).subtract(scale.side.max).length(), 
//    0, scale.min, scale.max)
//  ctx.restore()
//
//  ctx.save()
//  ctx.translate(Math.round(scale.side.min.x), Math.round(scale.side.min.y))
//  ctx.rotate(Math.PI*-0.5)
//  ruler(ctx, v(scale.side.min).subtract(scale.side.max).length(), Math.PI, scale.min, scale.max)
//  ctx.restore()

//  return //
  var draw = vec2Draw(ctx)
  opts = opts || {}
  var textHeight = parseInt(CTX.font)
  var side = scale.side || opts.side
  var log = opts.log

  function toScale (value) {
    return log ? Math.pow(Math.E, value) : value
  }

  function round (n) {
    return parseFloat(toScale(n).toPrecision(opts.precision || 3))
  }

  var min = side.min, max = side.max, align = side.align
  draw.strokeStyle('black').fillStyle('black').start().move(min).line(max)  

  var textWidth = ctx.measureText(round(scale.max)).width
  var textSize = align.x ? textHeight : textWidth

  var room   = v(max).subtract(min).length()
  var vec    = v(max).subtract(min).normalize()
  var offset = v(align).multiply((align.x > 0 ? textHeight : textHeight*1.5))
  var dash   = v(align).multiply(5)
  var markV  = v()
  var textV = v()

  //how many marks can fit on the graph?
  //if it's linear, that is simple
  //if it's logarithmic, that is a little more complex.
  //for now, we only support powers of 10 on the scale.
  var xScale = room/(scale.max - scale.min)
  //figure out step size for linear axis

  steps(scale.min, scale.max, {room:room, width:textWidth}, function (value) {
    markV.set(vec).multiply(value*xScale).add(min)
    draw
      .textAlign('center')
      .text(
        round(scale.min + value),
        textV.set(markV).add(offset),
        {rotate: !!align.x} //90 degrees
      )
      .move(markV)
      .line(markV.add(dash))
  })

  //maybe this should be completely separate?

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

