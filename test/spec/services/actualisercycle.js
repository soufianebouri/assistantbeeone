'use strict';

describe('Service: actualisercycle', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var actualisercycle;
  beforeEach(inject(function (_actualisercycle_) {
    actualisercycle = _actualisercycle_;
  }));

  it('should do something', function () {
    expect(!!actualisercycle).toBe(true);
  });

});
