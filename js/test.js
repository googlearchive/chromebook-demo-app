var Test = {
  cases_: {}
};

Test.add = function(name, func) {
  this.cases_[name] = func;
};

Test.run = function(callback) {
  var results = [];
  for (var name in this.cases_) {
    this.error_ = null;
    try {
      this.cases_[name].call();
    } catch (e) {
      this.error_ = e;
    }
    results.push({
      name: name,
      error: this.error_
    });
  }
  callback(results);
};

var Assert = {};

Assert.notNull = function(obj) {
  if (obj == null) {
    throw new Error('The value is null.');
  }
};

Assert.equals = function(expected, actual) {
  if (expected != actual) {
    throw new Error('Expected "' + expected + '" but "' + actual + '".');
  }
};

window.addEventListener('load', function() {
  Test.run(function(results) {
    var container = document.getElementsByTagName('body')[0];
    for (var i = 0; i < results.length; i++) {
      var elem = document.createElement('div');
      elem.className = results[i].error ? 'failed' : 'succeed';
      var name = document.createElement('h2');
      name.innerText = results[i].name;
      elem.appendChild(name);
      if (results[i].error) {
        var err = results[i].error;
        var details = document.createElement('div');
        details.className = 'details';
        details.innerText = err.stack;
        console.error(err.stack);
        elem.appendChild(details);
      }
      container.appendChild(elem);
    }
  });
});
