'use strict';

describe('Service: uniteoperation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var uniteoperation;
  beforeEach(inject(function (_uniteoperation_) {
    uniteoperation = _uniteoperation_;
  }));

  it('should do something', function () {
    expect(!!uniteoperation).toBe(true);
  });

});
