'use strict';

describe('Service: scoring', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var scoring;
  beforeEach(inject(function (_scoring_) {
    scoring = _scoring_;
  }));

  it('should do something', function () {
    expect(!!scoring).toBe(true);
  });

});
