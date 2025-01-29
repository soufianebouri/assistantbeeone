'use strict';

describe('Service: parametretechnique', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var parametretechnique;
  beforeEach(inject(function (_parametretechnique_) {
    parametretechnique = _parametretechnique_;
  }));

  it('should do something', function () {
    expect(!!parametretechnique).toBe(true);
  });

});
