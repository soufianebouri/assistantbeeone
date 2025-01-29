'use strict';

describe('Service: solutionmere', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var solutionmere;
  beforeEach(inject(function (_solutionmere_) {
    solutionmere = _solutionmere_;
  }));

  it('should do something', function () {
    expect(!!solutionmere).toBe(true);
  });

});
