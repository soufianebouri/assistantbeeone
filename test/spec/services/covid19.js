'use strict';

describe('Service: covid19', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var covid19;
  beforeEach(inject(function (_covid19_) {
    covid19 = _covid19_;
  }));

  it('should do something', function () {
    expect(!!covid19).toBe(true);
  });

});
