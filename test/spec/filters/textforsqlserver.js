'use strict';

describe('Filter: textforsqlserver', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var textforsqlserver;
  beforeEach(inject(function ($filter) {
    textforsqlserver = $filter('textforsqlserver');
  }));

  it('should return the input prefixed with "textforsqlserver filter:"', function () {
    var text = 'angularjs';
    expect(textforsqlserver(text)).toBe('textforsqlserver filter: ' + text);
  });

});
