'use strict';

describe('Service: ferme', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ferme;
  beforeEach(inject(function (_ferme_) {
    ferme = _ferme_;
  }));

  it('should do something', function () {
    expect(!!ferme).toBe(true);
  });

});
