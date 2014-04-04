exports = module.exports = ruler

exports.steps = calcSteps

//must have range, room, and width
function calcSteps (min, max, room, width) {
  var range = max - min
  var i = 0, e

  while(true) {
    var e = Math.pow(10, i++)
    if(e > 10000000000)
      throw new Error('oops')

    var re = range/e
    var space = width*1.25

    if(room     / (re) > space) return e
    if(room*2   / (re) > space) return e*2
    if(room*2.5 / (re) > space) return e*2.5
    if(room*5   / (re) > space) return e*5
  }
}


/*
A WWAAAAYYY easier approach.
draw everything straight up and starting from zero.
then translate/rotate to that point before you draw it.

you just have to remember to pop the state again...
maybe it would be interesting if you could create independent drawing contexts,
but actually this is working pretty well.
*/

function ruler (ctx, length, nRotate, min, max) {
  var textHeight = parseInt(ctx.font)
  nRotate = nRotate || 0
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(length, 0)
  ctx.stroke()

  var i = 0
  var range = max - min
  var scale = length/range

  var step = calcSteps(min, max, length, ctx.measureText(max.toPrecision(4)).width)

  for(var i = 0; i < range/step; i++) {
    if(i > 1000) throw new Error('too many markings'+JSON.stringify([range, step, i]))
    ctx.save()
      ctx.translate(i*step*scale, 0)

      if(nRotate)
        ctx.rotate(nRotate)
      ctx.moveTo(0, 0)
      ctx.lineTo(0, textHeight/2)
      ctx.textAlign = 'center'
      ctx.fillText(i*step, 0, textHeight * 1.5)
      ctx.stroke()
    ctx.restore()
  }
}

