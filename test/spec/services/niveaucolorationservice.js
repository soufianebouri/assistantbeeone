'use strict';

describe('Service: NiveauColorationService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var NiveauColorationService;
  beforeEach(inject(function (_NiveauColorationService_) {
    NiveauColorationService = _NiveauColorationService_;
  }));

  it('should do something', function () {
    expect(!!NiveauColorationService).toBe(true);
  });

});
