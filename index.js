module.exports = estate

var old_Readable = require('readable-stream').Readable
  , new_Readable = require('stream').Readable
  , util = require('util')

var Readable = new_Readable || old_Readable

util.inherits(Estate, Readable)

function estate() {
  return new Estate()
}

function Estate() {
  var options = {}

  options.objectMode = true

  // only hold on to the most recent state
  options.highWaterMark = 1

  Readable.call(this, options)

  this.state = {}
  this.go = true

}

var cons = Estate
  , proto = cons.prototype

proto.constructor = proto

proto.close = function() {
  this.push(null)
  this.closed = true
}

proto.listen = function(to_ee, on_event, as_attrs) {
  var self = this

  to_ee.on(on_event, save)

  function save() {
    if(self.closed) {
      // if we're closed, stop updating
      return
    }

    for(var i = 0, len = as_attrs.length; i < len; ++i) {

      if(arguments[i] === undefined) {
        delete self.state[as_attrs[i]]
      }

      if(arguments[i] !== undefined) {
        self.state[as_attrs[i]] = arguments[i]
      }
    }

    if(self.go) {
      self.go = self.push(self.state)
    }
  }

  return self
}

proto._read = function(n) {
  // Nothing doing. Clients can read off the internal buffer populated by state
  // changes. It's up to them to prevent the internal buffer from growing in
  // case of back pressure
  this.go = true
}
