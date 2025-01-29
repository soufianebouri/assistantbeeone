'use strict';

describe('Service: EstimationActualise', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var EstimationActualise;
  beforeEach(inject(function (_EstimationActualise_) {
    EstimationActualise = _EstimationActualise_;
  }));

  it('should do something', function () {
    expect(!!EstimationActualise).toBe(true);
  });

});
