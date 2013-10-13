var EE = require('events').EventEmitter
  , estate = require('./index')
  , test = require('tape')

test('works as expected', function(assert) {
  var e1 = estate()
    , ee1 = new EE
    , ee2 = new EE

  e1.listen(ee1, 'thing', ['one', 'two'])
    .listen(ee2, 'data', ['two', 'three', 'four'])


  ee1.emit('thing', 1, 2)

  e1.once('data', function(state) {
    assert.deepEqual(state, {
        one: 1
      , two: 2
    })
  })


  e1.once('data', function(state) {
    assert.deepEqual(state, {
        one: 0
    })
  })

  ee1.emit('thing', 0)

  // set "one" to 0, "two" to 1
  ee1.emit('thing', 0, 1)

  e1.once('data', function(state) {
    assert.deepEqual(state, {
        one: 0
      , two: 10
      , three: 20
    })
  })

  ee2.emit('data', 10, 20)

  e1.once('data', function(state) {
    assert.ok(false, 'should never get hit')
  })

  ee1.emit('anything', 12)
  ee2.emit('else', 1000)

  assert.end()
})


test('Functions correctly as a pull stream', pull_stream_works)

function pull_stream_works(assert) {
  var state1 = estate()
    , state2 = estate()
    , ee = new EE
    , values = []
    , i = 0

  values.push('one')
  values.push('two')
  values.push('three')
  values.push('four')
  values.push('five')

  state1.listen(ee, 'beep', ['beep'])
  state2.listen(ee, 'beep', ['beep'])

  state1.on('readable', function() {
    var current_state

    while(current_state = this.read()) {
      assert.equal(current_state.beep, values[i++])
    }
  })

  for(var j = 0, len = values.length; j < len; ++j) {
    ee.emit('beep', values[j])
  }

  assert.strictEqual(state2.state.beep, 'five')
  assert.strictEqual(state1.state.beep, 'five')
  assert.strictEqual(state2.read().beep, 'five')

  assert.end()

}
