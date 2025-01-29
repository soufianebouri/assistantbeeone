'use strict';

describe('Service: modalAddPrevisionAnnuel', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var modalAddPrevisionAnnuel;
  beforeEach(inject(function (_modalAddPrevisionAnnuel_) {
    modalAddPrevisionAnnuel = _modalAddPrevisionAnnuel_;
  }));

  it('should do something', function () {
    expect(!!modalAddPrevisionAnnuel).toBe(true);
  });

});
