'use strict';

describe('Service: FermeService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var FermeService;
  beforeEach(inject(function (_FermeService_) {
    FermeService = _FermeService_;
  }));

  it('should do something', function () {
    expect(!!FermeService).toBe(true);
  });

});
