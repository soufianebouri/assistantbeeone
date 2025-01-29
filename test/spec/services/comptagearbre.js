'use strict';

describe('Service: comptageArbre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var comptageArbre;
  beforeEach(inject(function (_comptageArbre_) {
    comptageArbre = _comptageArbre_;
  }));

  it('should do something', function () {
    expect(!!comptageArbre).toBe(true);
  });

});
