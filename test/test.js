
function createFib () {
  return function fib (n) {
    return (
        n === 1 ? 1
      : n === 2 ? 1
      :           fib(n - 1) + fib(n - 2)
    )
  }
}

function createFib2 () {
  var data = []
  return function fib (n) {
    if(data[n]) return data[n]
    return data[n] = (
        n === 1 ? 1
      : n === 2 ? 1
      :           fib(n - 1) + fib(n - 2)
    )
  }
}

function createFibRandom () {
  var data = []
  return function fib (n) {
    if(data[n] && Math.random() > 0.1) return data[n]
    return data[n] = (
        n === 1 ? 1
      : n === 2 ? 1
      :           fib(n - 1) + fib(n - 2)
    )
  }
}


function createFib3 () {
  var data = []
  return function fib (n) {
    var d
    return (
        n === 1     ? 1
      : n === 2     ? 1
      : (d = data[n]) ? d
      :           data[n] = fib(n - 1) + fib(n - 2)
    )
  }
}

console.log('N (N), Naive (ops/ms), Memoized (ops/ms), AvoidLookups (ops/ms), Random (ops/ms)')

function test(f, n) {
  var fib = f()
  var s = Date.now(), e, i = 0
  while((e = Date.now()) - s < 100)
    fib(n), i++
  return i/(e-s)
}

for(var n = 1; n <= 40; n++) {
  console.log([
    n,
    test(createFib, n),
    test(createFib2, n),
    test(createFib3, n),
    test(createFibRandom, n)
  ].join(', '))
}
