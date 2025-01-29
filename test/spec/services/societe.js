'use strict';

describe('Service: societe', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var societe;
  beforeEach(inject(function (_societe_) {
    societe = _societe_;
  }));

  it('should do something', function () {
    expect(!!societe).toBe(true);
  });

});
