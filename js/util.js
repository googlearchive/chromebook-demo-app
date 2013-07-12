var util = {
  defineEnum: function() {
    var result = {};
    for (var i = 0; i < arguments.length; i++) {
      result[arguments[i]] = arguments[i];
    }
    return result;
  }
};

var HandlerList = function() {
  this.handlers_ = [];
};

HandlerList.prototype.add = function(elem, eventName, handler) {
  this.handlers_.push([elem, eventName, handler]);
  elem.addEventListener(eventName, handler);
};

HandlerList.prototype.reset = function() {
  while (this.handlers_.length) {
    var handler = this.handlers_.pop();
    handler[0].removeEventListener(handler[1], handler[2]);
  }
};
