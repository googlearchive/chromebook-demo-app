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
