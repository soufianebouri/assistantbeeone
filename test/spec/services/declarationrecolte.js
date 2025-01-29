'use strict';

describe('Service: declarationrecolte', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var declarationrecolte;
  beforeEach(inject(function (_declarationrecolte_) {
    declarationrecolte = _declarationrecolte_;
  }));

  it('should do something', function () {
    expect(!!declarationrecolte).toBe(true);
  });

});
