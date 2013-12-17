function r (v) {
  return Math.round(v)
}

module.exports =
  function vecDraw (ctx) {
    if(ctx.getContext) //check if a canvas was passed in
      ctx = ctx.getContext('2d')
    return {
      text: function (string, vec, opts) {
        if(opts && opts.rotate === true) {
          ctx.save();
          ctx.translate(r(vec.x), r(vec.y))
          ctx.rotate(Math.PI/2)
          ctx.fillText(string, 0, 0);
          ctx.restore(); return this
        }
        ctx.fillText(string, vec.x, vec.y); return this
      },
      textAlign: function (style) {
        if(!arguments.length) return ctx.textAlign
        ctx.textAlign = style; return this
      },
      move: function (vec) {
        ctx.moveTo(r(vec.x), r(vec.y)); return this
      },
      line: function (vec) {
        ctx.lineTo(r(vec.x), r(vec.y)); return this
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
      fillStyle: function (style) {
        if(!arguments.length) return ctx.fillStyle
        ctx.fillStyle = style; return this
      },
    }
  }

