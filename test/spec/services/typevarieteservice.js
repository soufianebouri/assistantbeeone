'use strict';

describe('Service: TypeVarieteService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var TypeVarieteService;
  beforeEach(inject(function (_TypeVarieteService_) {
    TypeVarieteService = _TypeVarieteService_;
  }));

  it('should do something', function () {
    expect(!!TypeVarieteService).toBe(true);
  });

});
