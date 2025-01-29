'use strict';

describe('Filter: getNumberAsTonne', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var getNumberAsTonne;
  beforeEach(inject(function ($filter) {
    getNumberAsTonne = $filter('getNumberAsTonne');
  }));

  it('should return the input prefixed with "getNumberAsTonne filter:"', function () {
    var text = 'angularjs';
    expect(getNumberAsTonne(text)).toBe('getNumberAsTonne filter: ' + text);
  });

});
