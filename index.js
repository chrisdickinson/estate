module.exports = estate

var EE = require('events').EventEmitter

function estate() {
  return new Estate()
}

function Estate() {
  EE.call(this)
  this._state = {}
}

var cons = Estate
  , proto = cons.prototype = Object.create(EE.prototype)

proto.constructor = proto

proto.listen = function(to_ee, on_event, as_attrs) {
  var self = this

  to_ee.on(on_event, function() {
    for(var i = 0, len = as_attrs.length; i < len; ++i) {
      if(arguments[i] === undefined) {
        delete self._state[as_attrs[i]]
      } else {
        self._state[as_attrs[i]] = arguments[i]
      }
    }
    self.emit('data', self._state)
  })

  return self
}
