'use strict';

describe('Service: ElementsMinerauxService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ElementsMinerauxService;
  beforeEach(inject(function (_ElementsMinerauxService_) {
    ElementsMinerauxService = _ElementsMinerauxService_;
  }));

  it('should do something', function () {
    expect(!!ElementsMinerauxService).toBe(true);
  });

});
