'use strict';

describe('Service: realisation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var realisation;
  beforeEach(inject(function (_realisation_) {
    realisation = _realisation_;
  }));

  it('should do something', function () {
    expect(!!realisation).toBe(true);
  });

});
