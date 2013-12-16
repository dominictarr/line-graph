
var pull = require('pull-stream')

module.exports = function (table) {
  var headers = table.shift()
  return table.reduce(function (acc, item) {
    item.forEach(function (e, i) {
      if(isNaN(e)) return acc[i] = null

      if(acc[i] == null)
        acc[i] = {sum: e, count: 1, mean: e, min: e, max: e, title: headers[i].name || headers[i]}
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
  }, [])
}
