module.exports =
  function vecDraw (ctx) {
    if(ctx.getContext) //check if a canvas was passed in
      ctx = ctx.getContext('2d')
    return {
      text: function (string, vec) {
        ctx.fillText(string, vec.x, vec.y); return this
      },
      textAlign: function (style) {
        if(!arguments.length) return ctx.textAlign
        ctx.textAlign = style; return this
      },
      move: function (vec) {
        ctx.moveTo(vec.x, vec.y); return this
      },
      line: function (vec) {
        ctx.lineTo(vec.x, vec.y); return this
      },
      start: function () {
        ctx.beginPath(); return this
      },
      stroke: function () {
        ctx.stroke(); return this
      },
      strokeStyle: function (style) {
        if(!arguments.length) return ctx.strokeStyle
        ctx.strokeStyle = style; return this
      },
    }
  }

