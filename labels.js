module.exports =
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

