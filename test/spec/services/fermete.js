'use strict';

describe('Service: fermete', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var fermete;
  beforeEach(inject(function (_fermete_) {
    fermete = _fermete_;
  }));

  it('should do something', function () {
    expect(!!fermete).toBe(true);
  });

});
