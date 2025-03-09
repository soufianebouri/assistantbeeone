'use strict';

describe('Service: prime', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var prime;
  beforeEach(inject(function (_prime_) {
    prime = _prime_;
  }));

  it('should do something', function () {
    expect(!!prime).toBe(true);
  });

});
