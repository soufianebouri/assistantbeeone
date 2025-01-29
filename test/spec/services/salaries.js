'use strict';

describe('Service: salaries', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var salaries;
  beforeEach(inject(function (_salaries_) {
    salaries = _salaries_;
  }));

  it('should do something', function () {
    expect(!!salaries).toBe(true);
  });

});
