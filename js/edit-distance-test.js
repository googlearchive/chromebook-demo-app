Test.add('calcEditDistanceForString', function() {
  var result = calcEditDistance('XTest', 'Text', 1, 1, 3);
  Assert.notNull(result);
  Assert.equals('Delete', result[0].operation);
  Assert.equals('None', result[1].operation);
  Assert.equals('None', result[2].operation);
  Assert.equals('None', result[5].operation);
  console.log(result);
});

Test.add('calcEditDistanceForTheSun', function() {
  var str1 = 'The sun';
  var str2 = 'The red burned sun';
  var result = calcEditDistance('The sun', 'The red burned sun', 1, 1, 3);
  var log1 = "";
  var log2 = "";
  for (var i = 0; i < result.length; i++) {
    if (result[i].operation == 'None') {
      log1 += str1[0];
      log2 += str2[0];
      str1 = str1.substr(1);
      str2 = str2.substr(1);
    } else if (result[i].operation == 'Insert') {
      log1 += ' ';
      log2 += str2[0];
      str2 = str2.substr(1);
    } else if (result[i].operation == 'Delete') {
      log1 += str1[0];
      log2 += ' ';
      str1 = str1.substr(1);
    }
  }
  /*
  Assert.notNull(result);
  Assert.equals('Delete', result[0].operation);
  Assert.equals('None', result[1].operation);
  Assert.equals('None', result[2].operation);
  Assert.equals('None', result[5].operation);
  */
  console.log([log1, log2].join("\n"));
});

Test.add('calcEditDistanceForArray', function() {
  var result = calcEditDistance(['Dog', 'Cat', 'Monkey', 'Bird'],
                                ['Cat', 'Bird', 'Bird'], 1, 1, 3);
  Assert.notNull(result);
  Assert.equals('Delete', result[0].operation);
  Assert.equals('None', result[1].operation);
  Assert.equals('Insert', result[2].operation);
  Assert.equals('Delete', result[3].operation);
  console.log(result);
});

var INDEX_MAP = function() {
  var diff_source = '_++_---_++++__';
  // 01234567
  // 0**15****67

  var operations = {'_': 'None', '+': 'Insert', '-': 'Delete'};
  var diff = [];
  for (var i = 0; i < diff_source.length; i++) {
    diff.push({operation: operations[diff_source[i]]});
  }
  return IndexMap.fromDiff(diff);
}.call();

Test.add('IndexMap.fromDiff', function() {
  var indexMap = INDEX_MAP;

  Assert.equals(6, indexMap.blocks_.length);

  Assert.equals(0, indexMap.blocks_[0].index);
  Assert.equals(1, indexMap.blocks_[1].index);
  Assert.equals(2, indexMap.blocks_[2].index);
  Assert.equals(5, indexMap.blocks_[3].index);
  Assert.equals(6, indexMap.blocks_[4].index);

  Assert.equals(0, indexMap.blocks_[0].offset);
  Assert.equals(2, indexMap.blocks_[1].offset);
  Assert.equals(true, indexMap.blocks_[2].deleted);
  Assert.equals(-1, indexMap.blocks_[3].offset);
  Assert.equals(3, indexMap.blocks_[4].offset);
});

Test.add('indexMap#map', function() {
  var indexMap = INDEX_MAP;
  Assert.equals(0, indexMap.map(0));
  Assert.equals(3, indexMap.map(1));
  Assert.equals(4, indexMap.map(2));
  Assert.equals(4, indexMap.map(3));
  Assert.equals(4, indexMap.map(4));
  Assert.equals(4, indexMap.map(5));
  Assert.equals(9, indexMap.map(6));
});

Test.add('indexMap#isRangeChanged', function() {
  var indexMap = INDEX_MAP;
  Assert.equals(false, indexMap.isRangeChanged(0, 1));
  Assert.equals(false, indexMap.isRangeChanged(1, 1));
  Assert.equals(true, indexMap.isRangeChanged(1, 2));
  Assert.equals(true, indexMap.isRangeChanged(2, 1));
  Assert.equals(false, indexMap.isRangeChanged(6, 2));
});
