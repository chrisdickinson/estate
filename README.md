# estate
[![Build
Status](https://travis-ci.org/AWinterman/estate.png?branch=master)](https://travis-ci.org/AWinterman/estate)

aggregate multiple event emitter events + data into a readable stream of state
objects.

```javascript
var es = estate()
  , ee1 = new EE
  , ee2 = new EE

es.listen(ee1, 'thing', ['one', 'two'])
  .listen(ee2, 'data', ['two', 'three', 'four'])

ee1.emit('thing', 1, 2)

es.once('data', function(state) {
  // state will be === {
  //   one: 1
  //   two: 10
  //   three: 20
  //   four: 30
  // }
})

ee2.emit('data', 10, 20, 30)

es.once('data', function(state) {
  // one and two will be cleared!
})

ee1.emit('thing') // since "one" and "two" are undefined, it'll clear those states
```

**or in terms of Streams2**

```javascript

es.on('readable', function() {
  var state = es.read()
})

```

**or just pipe:**

```javascript
es.pipe(debounce).pipe(make_xhr).pipe($(el))

```

## API

#### `es.listen(emitter, eventName, ['list', 'of', 'bindings'])` -> `es`

listen to an `emitter` on `eventName`. when that emitter emits that event name,
it will update the state object. The state object will expose the current state by
`.read()`.

`estate` will buffer *only* the most recent state. This means its information
is always up to date-- if you only read() when you are ready for more data, (or
have the proper back pressure if your using it in flowing mode), debouncing is
not required.

## License

MIT
