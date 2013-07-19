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
    for(var i = 1; i <= seq1.length; i++) {
      var index = j * seq1.length + i;
      var deleteFrom = j * seq1.length + i - 1;
      var insertFrom = (j - 1) * seq1.length + i;
      var replaceFrom = (j - 1) * seq1.length + i - 1;
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
  return result;
};
