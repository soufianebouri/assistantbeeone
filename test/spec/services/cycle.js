'use strict';

describe('Service: cycle', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var cycle;
  beforeEach(inject(function (_cycle_) {
    cycle = _cycle_;
  }));

  it('should do something', function () {
    expect(!!cycle).toBe(true);
  });

});
