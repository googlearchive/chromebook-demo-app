Test.add('editorTest', function() {
  var entireText = 'I have two pencils given by my marents.';
  var keyword = 'two pencils';
  var index = entireText.lastIndexOf(keyword);
  Assert.notEquals(-1, index);
  var editor = new Editor(0, keyword, 'Type', 'two pretty pencils');
  while (true) {
    var result = editor.step(null);
    if (result == 'Exit') return;
  }
});

Test.add('editorTest', function() {
  var entireText = 'I have two pencils given by my marents.';
  var keyword = 'two pencils';
  var index = entireText.lastIndexOf(keyword);
});
