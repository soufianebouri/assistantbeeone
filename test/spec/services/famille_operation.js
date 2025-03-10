'use strict';

describe('Service: familleOperation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var familleOperation;
  beforeEach(inject(function (_familleOperation_) {
    familleOperation = _familleOperation_;
  }));

  it('should do something', function () {
    expect(!!familleOperation).toBe(true);
  });

});
