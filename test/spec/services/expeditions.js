'use strict';

describe('Service: expeditions', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var expeditions;
  beforeEach(inject(function (_expeditions_) {
    expeditions = _expeditions_;
  }));

  it('should do something', function () {
    expect(!!expeditions).toBe(true);
  });

});
