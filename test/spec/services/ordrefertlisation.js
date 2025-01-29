'use strict';

describe('Service: ordrefertlisation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ordrefertlisation;
  beforeEach(inject(function (_ordrefertlisation_) {
    ordrefertlisation = _ordrefertlisation_;
  }));

  it('should do something', function () {
    expect(!!ordrefertlisation).toBe(true);
  });

});
