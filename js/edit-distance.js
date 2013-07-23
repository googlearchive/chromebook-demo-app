var Cell = function(cost, prevCell, operation) {
  this.cost = cost;
  this.prevCell = prevCell;
  this.operation = operation;
};

/**
 * Calcs the edit distance and between two sequences (Array, String) and
 * returnes operations that changes seq1 to seq2.
 */
var calcEditDistance = function(seq1,
                                seq2,
                                insertCost,
                                deleteCost,
                                replaceCost) {
  // Find minimum path.
  var matrix = [new Cell(0, null, 'Start')];
  var gurde = new Cell(0, null, 'Gurde');
  for (var j = 0; j <= seq2.length; j++) {
    for(var i = 0; i <= seq1.length; i++) {
      if (i == 0 && j == 0)
        continue;
      var index = j * (seq1.length + 1) + i;
      var deleteFrom = j * (seq1.length + 1) + i - 1;
      var insertFrom = (j - 1) * (seq1.length + 1) + i;
      var replaceFrom = (j - 1) * (seq1.length + 1) + i - 1;
      var deleteCostHere = (matrix[deleteFrom] || gurde).cost + deleteCost;
      var insertCostHere = (matrix[insertFrom] || gurde).cost + insertCost;
      var noneCostHere = (matrix[replaceFrom] || gurde).cost;
      var replaceCostHere = noneCostHere + replaceCost;
      if (j == 0) {
        // Delete
        matrix[index] = new Cell(deleteCostHere, matrix[deleteFrom], 'Delete');
      } else if (i == 0) {
        // Insert
        matrix[index] = new Cell(insertCostHere, matrix[insertFrom], 'Insert');
      } else if (seq1[i - 1] == seq2[j - 1]) {
        // None
        matrix[index] = new Cell(noneCostHere, matrix[replaceFrom], 'None');
      } else if (deleteCostHere <= insertCostHere &&
                 deleteCostHere <= replaceCostHere) {
        // Delete
        matrix[index] = new Cell(deleteCostHere, matrix[deleteFrom], 'Delete');
      } else if (insertCostHere <= deleteCostHere &&
                 insertCostHere <= replaceCostHere) {
        // Insert
        matrix[index] = new Cell(insertCostHere, matrix[insertFrom], 'Insert');
      } else {
        // Replace
        matrix[index] = new Cell(
            replaceCostHere, matrix[replaceFrom], 'Replace');
      }
    }
  }

  // Make the minimum path list.
  var result = [matrix[matrix.length - 1]];
  while (result[0].prevCell) {
    result.unshift(result[0].prevCell);
  }
  result.shift();
  return result;
};

var IndexMap = function(blocks) {
  this.blocks_ = blocks;
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
  blocks.push({index: Number.MAX_VALUE});

  // Remove unused information
  for (var i = 0; i < blocks.length; i++) {
    delete blocks[i].inserted;
    delete blocks[i].length;
    if (blocks[i].deleted)
      delete blocks[i].offset;
  }
  return new IndexMap(blocks);
};

/**
 * Map the index of the old text to the index of the new one.
 */
IndexMap.prototype.map = function(index) {
  for (var i = 0; i < this.blocks_.length; i++) {
    if (this.blocks_[i].index <= index && index < this.blocks_[i + 1].index) {
      if (this.blocks_[i].deleted)
        return this.blocks_[i].index + this.blocks_[i - 1].offset;
      else
        return index + this.blocks_[i].offset;
    }
  }
  return null;
};

IndexMap.prototype.isRangeChanged = function(index, length) {
  for (var i = 0; i < this.blocks_.length; i++) {
    if (this.blocks_[i].index <= index && index < this.blocks_[i + 1].index) {
      if (this.blocks_[i].deleted)
        return true;
      else
        return !(index + length <= this.blocks_[i + 1].index);
    }
  }
  return null;
};
