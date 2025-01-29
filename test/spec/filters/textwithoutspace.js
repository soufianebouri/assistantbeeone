'use strict';

describe('Filter: TextWithoutSpace', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var TextWithoutSpace;
  beforeEach(inject(function ($filter) {
    TextWithoutSpace = $filter('TextWithoutSpace');
  }));

  it('should return the input prefixed with "TextWithoutSpace filter:"', function () {
    var text = 'angularjs';
    expect(TextWithoutSpace(text)).toBe('TextWithoutSpace filter: ' + text);
  });

});
