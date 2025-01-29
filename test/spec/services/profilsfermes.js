'use strict';

describe('Service: profilsfermes', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var profilsfermes;
  beforeEach(inject(function (_profilsfermes_) {
    profilsfermes = _profilsfermes_;
  }));

  it('should do something', function () {
    expect(!!profilsfermes).toBe(true);
  });

});
