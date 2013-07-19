Test.add('calcEditDistanceForString', function() {
  var result = calcEditDistance("XTest", "Text", 1, 1, 3);
  Assert.notNull(result);
  Assert.equals('Start', result[0].operation);
  Assert.equals('Delete', result[1].operation);
  Assert.equals('None', result[2].operation);
  Assert.equals('None', result[3].operation);
  Assert.equals('None', result[6].operation);
  console.log(result);
});

Test.add('calcEditDistanceForArray', function() {
  var result = calcEditDistance(["Dog", "Cat", "Monkey", "Bird"],
                                ["Cat", "Bird", "Bird"], 1, 1, 3);
  Assert.notNull(result);
  Assert.equals('Start', result[0].operation);
  Assert.equals('Delete', result[1].operation);
  Assert.equals('None', result[2].operation);
  Assert.equals('Insert', result[3].operation);
  Assert.equals('Delete', result[4].operation);
  console.log(result);
});
