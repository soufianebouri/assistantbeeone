'use strict';

describe('Service: OperationService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var OperationService;
  beforeEach(inject(function (_OperationService_) {
    OperationService = _OperationService_;
  }));

  it('should do something', function () {
    expect(!!OperationService).toBe(true);
  });

});
