var PaperEditAdapter = {};

PaperEditAdapter.getTextNodeAt = function(index) {
  var result = document.evaluate(
      './/node()[self::text() or self::br or self::div]', this, null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var lastTextNode = null;
  var lastIsBr;
  for (var i = 0; i < result.snapshotLength; i++) {
    var textNode = result.snapshotItem(i);
    if (textNode.nodeValue != null) {
      // text node
      lastTextNode = textNode;
      var length = textNode.nodeValue.length;
      if (index < length)
        return {textNode: textNode, subindex: index};
      index -= length;
      lastIsBr = false;
    } else {
      if (lastIsBr && textNode.name() == 'div') {
        lastIsBr = false;
        continue;
      }
      if (lastIsBr && textNode.name() == 'br') {
        lastIsBr = true;
      } else {
        lastIsBr = false;
      }
      // br node
      index -= 1;
    }
  }
  return lastTextNode ? {
    textNode: lastTextNode,
    subindex: lastTextNode.length
  } : null;
};

PaperEditAdapter.insertChar = function(index, ch) {
  this.value = this.value.substr(0, index) + ch + this.value.substr(index);
};

PaperEditAdapter.deleteChar = function(index) {
  this.value = this.value.substr(0, index) + this.value.substr(index + 1);
};
