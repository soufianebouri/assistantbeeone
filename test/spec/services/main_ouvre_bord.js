'use strict';

describe('Service: mainOuvreBord', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var mainOuvreBord;
  beforeEach(inject(function (_mainOuvreBord_) {
    mainOuvreBord = _mainOuvreBord_;
  }));

  it('should do something', function () {
    expect(!!mainOuvreBord).toBe(true);
  });

});
