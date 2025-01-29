'use strict';

describe('Service: parcelle', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var parcelle;
  beforeEach(inject(function (_parcelle_) {
    parcelle = _parcelle_;
  }));

  it('should do something', function () {
    expect(!!parcelle).toBe(true);
  });

});
