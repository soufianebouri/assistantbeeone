'use strict';

describe('Service: generation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var generation;
  beforeEach(inject(function (_generation_) {
    generation = _generation_;
  }));

  it('should do something', function () {
    expect(!!generation).toBe(true);
  });

});
