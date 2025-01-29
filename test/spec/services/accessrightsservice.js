'use strict';

describe('Service: AccessRightsService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var AccessRightsService;
  beforeEach(inject(function (_AccessRightsService_) {
    AccessRightsService = _AccessRightsService_;
  }));

  it('should do something', function () {
    expect(!!AccessRightsService).toBe(true);
  });

});
