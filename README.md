# estate

aggregate multiple event emitter events + data onto 
a single event emitter that emits data events on change.

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

## API

#### es.listen(emitter, eventName, ['list', 'of', 'bindings']) -> es

listen to an `emitter` on `eventName`. when that emitter emits that event name,
it will update the state object. the state object will then emit a `'data'` event
containing the current state.

## License

MIT
