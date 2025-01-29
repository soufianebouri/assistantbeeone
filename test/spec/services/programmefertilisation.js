'use strict';

describe('Service: programmefertilisation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var programmefertilisation;
  beforeEach(inject(function (_programmefertilisation_) {
    programmefertilisation = _programmefertilisation_;
  }));

  it('should do something', function () {
    expect(!!programmefertilisation).toBe(true);
  });

});
