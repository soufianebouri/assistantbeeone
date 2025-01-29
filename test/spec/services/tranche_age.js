'use strict';

describe('Service: TrancheAge', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var TrancheAge;
  beforeEach(inject(function (_TrancheAge_) {
    TrancheAge = _TrancheAge_;
  }));

  it('should do something', function () {
    expect(!!TrancheAge).toBe(true);
  });

});
