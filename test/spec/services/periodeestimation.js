'use strict';

describe('Service: PeriodeEstimation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var PeriodeEstimation;
  beforeEach(inject(function (_PeriodeEstimation_) {
    PeriodeEstimation = _PeriodeEstimation_;
  }));

  it('should do something', function () {
    expect(!!PeriodeEstimation).toBe(true);
  });

});
