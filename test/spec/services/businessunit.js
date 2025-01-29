'use strict';

describe('Service: BusinessUnit', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var BusinessUnit;
  beforeEach(inject(function (_BusinessUnit_) {
    BusinessUnit = _BusinessUnit_;
  }));

  it('should do something', function () {
    expect(!!BusinessUnit).toBe(true);
  });

});
