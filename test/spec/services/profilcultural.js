'use strict';

describe('Service: profilcultural', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var profilcultural;
  beforeEach(inject(function (_profilcultural_) {
    profilcultural = _profilcultural_;
  }));

  it('should do something', function () {
    expect(!!profilcultural).toBe(true);
  });

});
