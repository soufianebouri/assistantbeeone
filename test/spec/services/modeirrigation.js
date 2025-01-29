'use strict';

describe('Service: modeirrigation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var modeirrigation;
  beforeEach(inject(function (_modeirrigation_) {
    modeirrigation = _modeirrigation_;
  }));

  it('should do something', function () {
    expect(!!modeirrigation).toBe(true);
  });

});
