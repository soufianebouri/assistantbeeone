'use strict';

describe('Service: dashboardAccessRights', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var dashboardAccessRights;
  beforeEach(inject(function (_dashboardAccessRights_) {
    dashboardAccessRights = _dashboardAccessRights_;
  }));

  it('should do something', function () {
    expect(!!dashboardAccessRights).toBe(true);
  });

});
