var extend = function(base, adapter) {
  for (var name in adapter) {
    base[name] = adapter[name];
  }
  return base;
};

var HandlerList = function() {
  this.handlers_ = [];
  this.intervals_ = [];
};

HandlerList.prototype.add = function(elem, eventName, handler) {
  this.handlers_.push([elem, eventName, handler]);
  elem.addEventListener(eventName, handler);
};

HandlerList.prototype.setInterval = function(func, time) {
  this.intervals_.push(setInterval(func, time));
};

HandlerList.prototype.reset = function() {
  while (this.handlers_.length) {
    var handler = this.handlers_.pop();
    handler[0].removeEventListener(handler[1], handler[2]);
  }
  while (this.intervals_.length) {
    clearInterval(this.intervals_.pop());
  }
};
