'use strict';

describe('Service: ouviers', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ouviers;
  beforeEach(inject(function (_ouviers_) {
    ouviers = _ouviers_;
  }));

  it('should do something', function () {
    expect(!!ouviers).toBe(true);
  });

});
