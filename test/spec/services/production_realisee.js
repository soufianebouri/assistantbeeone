'use strict';

describe('Service: productionRealisee', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var productionRealisee;
  beforeEach(inject(function (_productionRealisee_) {
    productionRealisee = _productionRealisee_;
  }));

  it('should do something', function () {
    expect(!!productionRealisee).toBe(true);
  });

});
