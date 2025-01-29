'use strict';

describe('Service: categoriepesticide', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var categoriepesticide;
  beforeEach(inject(function (_categoriepesticide_) {
    categoriepesticide = _categoriepesticide_;
  }));

  it('should do something', function () {
    expect(!!categoriepesticide).toBe(true);
  });

});
