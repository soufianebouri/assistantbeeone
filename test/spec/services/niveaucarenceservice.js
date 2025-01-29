'use strict';

describe('Service: NiveauCarenceService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var NiveauCarenceService;
  beforeEach(inject(function (_NiveauCarenceService_) {
    NiveauCarenceService = _NiveauCarenceService_;
  }));

  it('should do something', function () {
    expect(!!NiveauCarenceService).toBe(true);
  });

});
