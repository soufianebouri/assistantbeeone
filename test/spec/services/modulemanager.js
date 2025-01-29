'use strict';

describe('Service: ModuleManager', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ModuleManager;
  beforeEach(inject(function (_ModuleManager_) {
    ModuleManager = _ModuleManager_;
  }));

  it('should do something', function () {
    expect(!!ModuleManager).toBe(true);
  });

});
