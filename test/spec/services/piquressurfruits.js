'use strict';

describe('Service: piquressurfruits', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var piquressurfruits;
  beforeEach(inject(function (_piquressurfruits_) {
    piquressurfruits = _piquressurfruits_;
  }));

  it('should do something', function () {
    expect(!!piquressurfruits).toBe(true);
  });

});
