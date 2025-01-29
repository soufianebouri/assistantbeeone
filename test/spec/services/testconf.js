'use strict';

describe('Service: testConf', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var testConf;
  beforeEach(inject(function (_testConf_) {
    testConf = _testConf_;
  }));

  it('should do something', function () {
    expect(!!testConf).toBe(true);
  });

});
