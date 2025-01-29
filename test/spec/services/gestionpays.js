'use strict';

describe('Service: gestionPays', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var gestionPays;
  beforeEach(inject(function (_gestionPays_) {
    gestionPays = _gestionPays_;
  }));

  it('should do something', function () {
    expect(!!gestionPays).toBe(true);
  });

});
