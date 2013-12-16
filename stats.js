
var pull = require('pull-stream')

module.exports = function (cb) {
  return pull.reduce(function (acc, item) {
    item.forEach(function (e, i) {
      if(isNaN(e)) return acc[i] = null

      if(acc[i] == null)
        acc[i] = {sum: e, count: 1, mean: e, min: e, max: e}
      else {
        var stat = acc[i]
        stat.sum += e
        stat.count ++
        stat.min = Math.min(e, stat.min)
        stat.max = Math.max(e, stat.max)
        stat.range = stat.max - stat.min
        stat.mean = stat.sum / stat.count
      }
    })
    return acc
  }, [], cb)
}
