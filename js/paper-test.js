Test.add('xpath', function() {
  var result = document.evaluate(
      './/node()[self::text() or self::br]',
      document.getElementById('xpath-test-box'),
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var lastTextNode = null;
  console.log(result.snapshotLength);
  for (var i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i));
  }
});