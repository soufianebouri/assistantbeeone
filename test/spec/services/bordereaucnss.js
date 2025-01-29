'use strict';

describe('Service: bordereaucnss', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var bordereaucnss;
  beforeEach(inject(function (_bordereaucnss_) {
    bordereaucnss = _bordereaucnss_;
  }));

  it('should do something', function () {
    expect(!!bordereaucnss).toBe(true);
  });

});
