
/**
 * Slice helper.
 *
 * @api private
 * @param {Arguments} args
 * @return {Array}
 */

var debug = require('debug')('axon:rep');

var slice = function(args){
  var len = args.length;
  var ret = new Array(len);

  for (var i = 0; i < len; i++) {
    ret[i] = args[i];
  }

  return ret;
}

var reply = function (sock, self) {
  return function() {
    var fn = function(){};
    var args = slice(arguments);
    args[0] = args[0] || null;

    var hasCallback = 'function' == typeof args[args.length - 1];
    if (hasCallback) fn = args.pop();

    args.push(id);

    if (sock.writable) {
      sock.write(self.pack(args), function(){ fn(true) });
      return true;
    } else {
      debug('peer went away');
      process.nextTick(function(){ fn(false) });
      return false;
    }
  }
}

exports = {
  slice: slice,
  reply: reply,
};

