'use strict';

describe('Service: jourferie', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var jourferie;
  beforeEach(inject(function (_jourferie_) {
    jourferie = _jourferie_;
  }));

  it('should do something', function () {
    expect(!!jourferie).toBe(true);
  });

});
