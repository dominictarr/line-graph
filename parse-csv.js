var split = require('pull-split')
var pull = require('pull-stream')

var parseCSV = module.exports = function (_headers, cb) {
  return pull(
    split(),
    pull.filter(),
    pull.map(function (line) {
      return line.split(',').map(function (e) {
        return isNaN(e) ? e : parseFloat(e)
      })
    })
  )
}

if(!module.parent) {
  pull(
    require('stream-to-pull-stream').read(process.stdin),
    parseCSV(),
    pull.collect(function (err, data) {
      if(err) throw err
      console.log(JSON.stringify(data, null, 2))
    })
  )
}
