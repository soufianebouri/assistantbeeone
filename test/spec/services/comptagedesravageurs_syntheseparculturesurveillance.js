'use strict';

describe('Service: comptagedesravageursSyntheseparculturesurveillance', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var comptagedesravageursSyntheseparculturesurveillance;
  beforeEach(inject(function (_comptagedesravageursSyntheseparculturesurveillance_) {
    comptagedesravageursSyntheseparculturesurveillance = _comptagedesravageursSyntheseparculturesurveillance_;
  }));

  it('should do something', function () {
    expect(!!comptagedesravageursSyntheseparculturesurveillance).toBe(true);
  });

});
