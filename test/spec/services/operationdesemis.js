'use strict';

describe('Service: operationdesemis', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var operationdesemis;
  beforeEach(inject(function (_operationdesemis_) {
    operationdesemis = _operationdesemis_;
  }));

  it('should do something', function () {
    expect(!!operationdesemis).toBe(true);
  });

});
