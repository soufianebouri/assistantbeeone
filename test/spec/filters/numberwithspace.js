'use strict';

describe('Filter: numberwithspace', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var numberwithspace;
  beforeEach(inject(function ($filter) {
    numberwithspace = $filter('numberwithspace');
  }));

  it('should return the input prefixed with "numberwithspace filter:"', function () {
    var text = 'angularjs';
    expect(numberwithspace(text)).toBe('numberwithspace filter: ' + text);
  });

});
