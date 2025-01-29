'use strict';

describe('Service: lesabsences', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var lesabsences;
  beforeEach(inject(function (_lesabsences_) {
    lesabsences = _lesabsences_;
  }));

  it('should do something', function () {
    expect(!!lesabsences).toBe(true);
  });

});
