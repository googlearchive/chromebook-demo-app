var Async = {};
Async.serial = function() {
  while (arguments.length > 1) {
    var next = Array.prototype.pop.call(arguments);
    arguments[arguments.length - 1] =
      arguments[arguments.length - 1].bind(null, next);
  }
  return arguments[0];
};

var Editor = function(index, originalText, type, text) {
  this.index_ = index;
  this.length_ = originalText.length;
  this.text_ = text;
  this.diff_ = calcEditDistance(originalText, text, 1, 1, 3);
  this.step_ = Async.serial(
      this.waitStep_.bind(this, 20),
      this.showCursorStep_.bind(this, 20),
      this.typeStep_.bind(this),
      this.waitStep_.bind(this, 20, null)
  );
};

/**
 * Apply the difference that is made by a user or other editors.
 */
Editor.prototype.applyIndexMap = function(indexMap) {
  console.log('apply');
  if (indexMap.isRangeChanged(this.index_, this.length_))
    return null;
  return this.index_ = indexMap.map(this.index_);
};

Editor.prototype.step = function(diff) {
  // Ensure that the target string is not touched by a user.
  // Update the index.
  // Step.
  if (this.step_) {
    var result = this.step_();
    this.step_ = result.next;
    return result.command;
  } else {
    return ['Exit'];
  }
};

Editor.prototype.waitStep_ = function(counter, next) {
  if (counter > 1)
    return {
      next: this.waitStep_.bind(this, counter - 1, next),
      command: ['None']
    };
  else
    return {
      next: next,
      command: ['None']
    };
};

Editor.prototype.showCursorStep_ = function(counter, next) {
  var result = this.waitStep_(counter, next);
  if (result)
    result.command = ['ShowCursor'];
  return result;
};

Editor.prototype.typeStep_ = function(next) {
  var diffStep = this.diff_.shift();
  var result = {};
  result.next = this.diff_.length ? this.typeStep_.bind(this, next) : next;
  if (diffStep.operation == 'None') {
    this.index_++;
    this.length_--;
    this.text_ = this.text_.substr(1);
    result.command = ['MoveCursor', this.index_];
  } else if (diffStep.operation == 'Delete') {
    this.length_--;
    result.command = ['Delete', this.index_];
  } else if (diffStep.operation == 'Insert') {
    result.command = ['Insert', this.index_, this.text_[0]];
    this.index_++;
    this.text_ = this.text_.substr(1);
  }
  return result;
};
