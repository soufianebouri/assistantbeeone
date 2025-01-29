'use strict';

describe('Service: comptagedesravageursSynthesesurveillance', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var comptagedesravageursSynthesesurveillance;
  beforeEach(inject(function (_comptagedesravageursSynthesesurveillance_) {
    comptagedesravageursSynthesesurveillance = _comptagedesravageursSynthesesurveillance_;
  }));

  it('should do something', function () {
    expect(!!comptagedesravageursSynthesesurveillance).toBe(true);
  });

});
