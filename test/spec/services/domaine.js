'use strict';

describe('Service: domaine', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var domaine;
  beforeEach(inject(function (_domaine_) {
    domaine = _domaine_;
  }));

  it('should do something', function () {
    expect(!!domaine).toBe(true);
  });

});
