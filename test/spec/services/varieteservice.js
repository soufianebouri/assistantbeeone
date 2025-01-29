'use strict';

describe('Service: VarieteService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var VarieteService;
  beforeEach(inject(function (_VarieteService_) {
    VarieteService = _VarieteService_;
  }));

  it('should do something', function () {
    expect(!!VarieteService).toBe(true);
  });

});
