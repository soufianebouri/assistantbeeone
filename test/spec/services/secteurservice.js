'use strict';

describe('Service: SecteurService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var SecteurService;
  beforeEach(inject(function (_SecteurService_) {
    SecteurService = _SecteurService_;
  }));

  it('should do something', function () {
    expect(!!SecteurService).toBe(true);
  });

});
