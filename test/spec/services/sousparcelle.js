'use strict';

describe('Service: sousparcelle', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var sousparcelle;
  beforeEach(inject(function (_sousparcelle_) {
    sousparcelle = _sousparcelle_;
  }));

  it('should do something', function () {
    expect(!!sousparcelle).toBe(true);
  });

});
