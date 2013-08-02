var Async = {};
Async.serial = function() {
  while (arguments.length > 1) {
    var next = Array.prototype.pop.call(arguments);
    arguments[arguments.length - 1] =
      arguments[arguments.length - 1].bind(null, next);
  }
  return arguments[0];
};

var Editor = function(index, originalText, text) {
  this.index_ = index;
  this.length_ = originalText.length;
  this.text_ = text;
  this.commands_ = Editor.buildCommands(index, originalText, text);
  this.diff_ = calcEditDistance(originalText, text, 1, 1, 3);
};

Editor.calcOffset_ = function(list) {
  var offset = 0;
  for (var i = 0; i < list.length; i++) {
    switch (list[i].operation) {
      case 'None':
        offset += list[i].element.length;
        break;
      case 'Delete':
        offset += list[i].done ? 0 : list[i].element.length;
        break;
      case 'Insert':
        offset += list[i].done ? list[i].element.length : 0;
        break;
      default:
        console.error('Not reached.');
        break;
    }
  }
  return offset;
};

/**
 * Builds the sequance of human-like editing commands from two text.
 */
Editor.buildCommands = function(index, source, result) {
  var sourceWords = source.split(/(\s+)/);
  var resultWords = result.split(/(\s+)/);
  var diff = calcEditDistance(sourceWords, resultWords, 1, 1, 3);
  var commands = [];
  var i, j;

  commands.push({name: 'HideCursor', frame: 20});
  commands.push({name: 'ShowCursor', frame: 20, offset: source.length});

  // Pick the delete operations first.
  for (i = diff.length - 1; i >= 0; i--) {
    var step = diff[i];
    if (step.operation != 'Delete')
      continue;
    var offset = Editor.calcOffset_(diff.slice(0, i));
    for (j = step.element.length - 1; j >= 0; j--) {
      commands.push({name: 'Delete', offset: offset + j});
    }
    step.done = true;
  }

  // Then pick the insert operations.
  for (i = 0; i < diff.length - 1; i++) {
    var step = diff[i];
    if (step.operation != 'Insert')
      continue;
    var offset = Editor.calcOffset_(diff.slice(0, i));
    for (j = 0; j < step.element.length; j++) {
      commands.push(
          {name: 'Insert', offset: offset + j, ch: step.element[j]});
    }
    step.done = true;
  }

  commands.push({name: 'HideCursor', frame: 1});
  return commands;
};

/**
 * Apply the difference that is made by a user or other editors.
 */
Editor.prototype.applyIndexMap = function(indexMap) {
  // Ensure that the target string is not touched by a user.
  // Update the index.
  // Step.
  if (indexMap.isRangeChanged(this.index_, this.length_))
    return false;
  this.index_ = indexMap.map(this.index_);
  this.lastCommand.index = this.lastCommand.offset + this.index_;
  return true;
};

Editor.prototype.step = function() {
  if (this.commands_.length == 0)
    return null;
  if (--this.commands_[0].frame > 0){
    command = this.commands_[0];
  } else {
    command = this.commands_.shift();
  }
  command.index = command.offset + this.index_;
  return this.lastCommand = command;
};
