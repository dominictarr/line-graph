module.exports = ruler
var vec2Draw = require('./vec2-canvas')
//must have range, room, and

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
  for(var i = 0; i < range/step; i++) {
    if(i > 1000) throw new Error('too many markings'+JSON.stringify([range, step, i]))
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

