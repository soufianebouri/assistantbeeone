'use strict';

describe('Service: atatdesvariables', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var atatdesvariables;
  beforeEach(inject(function (_atatdesvariables_) {
    atatdesvariables = _atatdesvariables_;
  }));

  it('should do something', function () {
    expect(!!atatdesvariables).toBe(true);
  });

});
