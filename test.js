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


test('Functions correctly as a pull stream', buffer_doesnt_grow)

function buffer_doesnt_grow(assert) {
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
    this.read().beep === values[i++]
  })

  for(var j = 0, len = values.length; j < len; ++j) {
    ee.emit('beep', values[j])
    assert.strictEqual(bufferlen(state1), 0)
    assert.strictEqual(bufferlen(state2), 1)
  }

  assert.strictEqual(bufferlen(state1), 0)
  console.log(state2)

  assert.strictEqual(state2.state.beep, 'five')
  assert.strictEqual(state1.state.beep, 'five')
  assert.strictEqual(state2.read().beep, 'five')

  assert.end()

  function bufferlen(state) {
    return state._readableState.buffer.length
  }
}

test(
    'Most recent state is the one that is emitted.'
  , emits_most_recent
)

function emits_most_recent(assert) {
  var obj_state = new estate()
    , ee = new EE

  obj_state.listen(ee, 'beep', ['beep'])

  ee.emit('beep', 0)
  ee.emit('beep', 1)
  ee.emit('beep', 2)

  var second_read
    , first_read

  // I'm cheating a little, because I know the stream is in a readable state.
  first_read = obj_state.read()
  second_read = obj_state.read()

  assert.deepEqual(first_read, {beep: 2})
  assert.deepEqual(second_read, {beep: 2})
  assert.end()
}
