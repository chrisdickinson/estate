var estate = require('./index')
  , EE = require('events').EventEmitter
  , test = require('tape')

test('works as expected', function(assert) {
  var e1 = estate()
    , ee1 = new EE
    , ee2 = new EE

  e1.listen(ee1, 'thing', ['one', 'two'])
    .listen(ee2, 'data', ['two', 'three', 'four'])

  e1.once('data', function(state) {
    assert.deepEqual(state, {
      one: 1
    , two: 2
    })
  })

  ee1.emit('thing', 1, 2)

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
