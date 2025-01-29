'use strict';

describe('Service: onboarding', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var onboarding;
  beforeEach(inject(function (_onboarding_) {
    onboarding = _onboarding_;
  }));

  it('should do something', function () {
    expect(!!onboarding).toBe(true);
  });

});
