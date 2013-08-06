var Cell = function(cost, prevCell, operation, element) {
  this.cost = cost;
  this.prevCell = prevCell;
  this.operation = operation;
  this.element = element;
};

var calcSimpleIndexMap = function(seq1, seq2) {
  var start = 0;
  while (seq1[start] == seq2[start] &&
         start < seq1.length &&
         start < seq2.length)
    start++;
  var end = 0;
  while (seq1[seq1.length - end - 1] == seq2[seq2.length - end - 1] &&
         start + end < seq1.length &&
         start + end < seq2.length)
    end++;
  return new IndexMap([
    {index: 0, offset: 0},
    {index: start, offset: 0, deleted: true},
    {index: seq1.length - end, offset: seq2.length - seq1.length}
  ]);
};

/**
 * Calcs the difference of two sequences (Array, String) and
 * returnes operations that changes seq1 to seq2.
 * @param {string|Array} seq1 Original sequence.
 * @param {string|Array} seq2 Edited sequence.
 * @param {number} insertCost Cost for inserting element.
 * @param {number} deleteCost Cost for deleting element.
 * @param {number} replaceCost Cost for replacing element.
 */
var calcEditDistance = function(seq1,
                                seq2,
                                insertCost,
                                deleteCost,
                                replaceCost) {
  // Prepare the matrix and find the minimum cost path by using DP.
  var matrix = [new Cell(0, null, 'Start', null)];
  // The zero is a psuade element used to simplify null check.
  var zero = new Cell(0, null, 'Zero', null);
  for (var j = 0; j <= seq2.length; j++) {
    for(var i = 0; i <= seq1.length; i++) {
      if (i == 0 && j == 0)
        continue;
      var index = j * (seq1.length + 1) + i;
      var deleteFrom = j * (seq1.length + 1) + i - 1;
      var insertFrom = (j - 1) * (seq1.length + 1) + i;
      var replaceFrom = (j - 1) * (seq1.length + 1) + i - 1;
      var deleteCostHere = (matrix[deleteFrom] || zero).cost + deleteCost;
      var insertCostHere = (matrix[insertFrom] || zero).cost + insertCost;
      var noneCostHere = (matrix[replaceFrom] || zero).cost;
      var replaceCostHere = noneCostHere + replaceCost;
      if (j == 0) {
        // Delete
        matrix[index] = new Cell(
            deleteCostHere, matrix[deleteFrom], 'Delete', seq1[i - 1]);
      } else if (i == 0) {
        // Insert
        matrix[index] = new Cell(
            insertCostHere, matrix[insertFrom], 'Insert', seq2[j - 1]);
      } else if (seq1[i - 1] == seq2[j - 1]) {
        // None
        matrix[index] = new Cell(
            noneCostHere, matrix[replaceFrom], 'None', seq1[i - 1]);
      } else if (deleteCostHere <= insertCostHere &&
                 deleteCostHere <= replaceCostHere) {
        // Delete
        matrix[index] = new Cell(
            deleteCostHere, matrix[deleteFrom], 'Delete', seq1[i - 1]);
      } else if (insertCostHere <= deleteCostHere &&
                 insertCostHere <= replaceCostHere) {
        // Insert
        matrix[index] = new Cell(
            insertCostHere, matrix[insertFrom], 'Insert', seq2[j - 1]);
      } else {
        // Replace
        matrix[index] = new Cell(
            replaceCostHere, matrix[replaceFrom], 'Replace',
            [seq1[i - 1], seq2[j - 1]]);
      }
    }
  }

  // Make the minimum path list.
  var result = [matrix[matrix.length - 1]];
  while (result[0].prevCell) {
    result.unshift(result[0].prevCell);
  }

  // Remove the psuade "Start" elemente.
  result.shift();
  return result;
};

var IndexMap = function(blocks) {
  this.blocks_ = blocks;
  this.blocks_.push({index: Number.MAX_VALUE});
  for (var i = 0; i < this.blocks_.length - 1;) {
    if (this.blocks_[i + 1].index - this.blocks_[i].index == 0)
      this.blocks_.splice(i, 1);
    else
      i++;
  }
};

/**
 * Obtain the index map from the diff that is obtained by calcEditDistance.
 */
IndexMap.fromDiff = function(diff) {
  var blocks = [{index: 0, length: 0, offset: 0}];
  var lastBlock = blocks[0];
  diff = diff.slice();
  diff.push({operation: 'None'});
  for (var i = 0; i < diff.length; i++) {
    switch (diff[i].operation) {
      case 'None':
      case 'Replace':
        if (lastBlock.deleted) {
          lastBlock = {
            index: lastBlock.index + lastBlock.length,
            length: 0,
            offset: lastBlock.offset
          };
          blocks.push(lastBlock);
        }
        lastBlock.length++;
        lastBlock.inserted = false;
        break;
      case 'Insert':
        if (!lastBlock.inserted) {
          lastBlock = {
            index: lastBlock.index + lastBlock.length,
            length: 0,
            offset: lastBlock.offset,
            inserted: true
          };
          blocks.push(lastBlock);
        }
        lastBlock.offset++;
        break;
      case 'Delete':
        if (!lastBlock.deleted) {
          lastBlock = {
            index: lastBlock.index + lastBlock.length,
            length: 0,
            offset: lastBlock.offset,
            deleted: true
          };
          blocks.push(lastBlock);
        }
        lastBlock.offset--;
        lastBlock.length++;
        break;
    }
  }

  // Remove unused information
  for (var i = 0; i < blocks.length; i++) {
    delete blocks[i].inserted;
    delete blocks[i].length;
    if (blocks[i].deleted)
      delete blocks[i].offset;
  }
  return new IndexMap(blocks);
};

IndexMap.fromCommand = function(command) {
  var offset = 0;
  if (command.name == 'Insert')
    offset = 1;
  else if (command.name == 'Delete')
    offset = -1;
  else
    return null;
  return new IndexMap([
    {index: 0, offset: 0},
    {index: command.index, offset: offset}
  ]);
};

/**
 * Map the index of the old text to the index of the new one.
 */
IndexMap.prototype.map = function(index) {
  var block = this.getBlockAt_(index);
  if (!block)
    return null;
  if (block.deleted) {
    return block.index +
        (this.blocks_[block.i - 1] ? this.blocks_[block.i - 1].offset : 0);
  }
  else
    return index + block.offset;
};

IndexMap.prototype.isRangeChanged = function(index, length) {
  var block = this.getBlockAt_(index);
  if (!block)
    return null;
  if (block.deleted)
    return true;
  else
    return !(index + length <= this.blocks_[block.i + 1].index);
};

IndexMap.prototype.isDeleted = function(index) {
  return this.getBlockAt_(index).deleted;
};

IndexMap.prototype.getBlockAt_ = function(index) {
  for (var i = 0; i < this.blocks_.length; i++) {
    if (this.blocks_[i].index <= index && index < this.blocks_[i + 1].index) {
      this.blocks_[i].i = i;
      return this.blocks_[i];
    }
  }
  return null;
};
