Test.add('getTextNodeAt', function() {
  var paper = document.getElementById('xpath-test-box');
             paper.addEventListener('input', function(e) { console.log(e); });
  extend(paper, PaperEditAdapter);
  for (var i = 0; i < paper.innerText.length; i++) {
    var result = paper.getTextNodeAt(i);
    if (paper.innerText[i] == '\n')
      continue;
    Assert.equals(
        paper.innerText[i], result.textNode.nodeValue[result.subindex]);
  }
});
