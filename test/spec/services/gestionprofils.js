'use strict';

describe('Service: gestionprofils', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var gestionprofils;
  beforeEach(inject(function (_gestionprofils_) {
    gestionprofils = _gestionprofils_;
  }));

  it('should do something', function () {
    expect(!!gestionprofils).toBe(true);
  });

});
