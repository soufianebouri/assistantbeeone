'use strict';

describe('Service: ValidationAutoObservation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ValidationAutoObservation;
  beforeEach(inject(function (_ValidationAutoObservation_) {
    ValidationAutoObservation = _ValidationAutoObservation_;
  }));

  it('should do something', function () {
    expect(!!ValidationAutoObservation).toBe(true);
  });

});
