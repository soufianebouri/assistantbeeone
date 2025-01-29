'use strict';

describe('Service: NiveauAttaque', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var NiveauAttaque;
  beforeEach(inject(function (_NiveauAttaque_) {
    NiveauAttaque = _NiveauAttaque_;
  }));

  it('should do something', function () {
    expect(!!NiveauAttaque).toBe(true);
  });

});
