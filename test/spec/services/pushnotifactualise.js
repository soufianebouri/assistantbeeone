'use strict';

describe('Service: pushNotifActualise', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var pushNotifActualise;
  beforeEach(inject(function (_pushNotifActualise_) {
    pushNotifActualise = _pushNotifActualise_;
  }));

  it('should do something', function () {
    expect(!!pushNotifActualise).toBe(true);
  });

});
