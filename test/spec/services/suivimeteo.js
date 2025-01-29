'use strict';

describe('Service: suivimeteo', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var suivimeteo;
  beforeEach(inject(function (_suivimeteo_) {
    suivimeteo = _suivimeteo_;
  }));

  it('should do something', function () {
    expect(!!suivimeteo).toBe(true);
  });

});
