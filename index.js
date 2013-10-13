module.exports = estate

var Readable = require('stream').Readable
  , util = require('util')

util.inherits(Estate, Readable)

function estate() {
  return new Estate()
}

function Estate() {
  var options = {}

  options.objectMode = true
  options.highWaterMark = 2
  Readable.call(this, options)

  this.state = {}
  this.more = true
}

var cons = Estate
  , proto = cons.prototype

proto.constructor = proto

proto.listen = function(to_ee, on_event, as_attrs) {
  var self = this

  to_ee.on(on_event, function() {
    for(var i = 0, len = as_attrs.length; i < len; ++i) {

      if(arguments[i] === undefined) {
        delete self.state[as_attrs[i]]
      }

      if(arguments[i] !== undefined) {
        self.state[as_attrs[i]] = arguments[i]
      }
    }

    self.more = self.unshift(self.state)

    // This feels bad-- the goal is that in the event of back pressure, the
    // stream still only holds on to the most recent state.
    if(!self.more) {
      self._readableState.buffer.pop()
      self._readableState.length--
    }

  })

  return self
}

proto._read = function() {
}
