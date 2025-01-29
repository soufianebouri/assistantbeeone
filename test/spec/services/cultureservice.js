'use strict';

describe('Service: cultureService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var cultureService;
  beforeEach(inject(function (_cultureService_) {
    cultureService = _cultureService_;
  }));

  it('should do something', function () {
    expect(!!cultureService).toBe(true);
  });

});
