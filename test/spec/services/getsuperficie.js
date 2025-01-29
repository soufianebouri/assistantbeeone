'use strict';

describe('Service: getsuperficie', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var getsuperficie;
  beforeEach(inject(function (_getsuperficie_) {
    getsuperficie = _getsuperficie_;
  }));

  it('should do something', function () {
    expect(!!getsuperficie).toBe(true);
  });

});
