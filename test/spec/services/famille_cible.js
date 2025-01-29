'use strict';

describe('Service: familleCible', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var familleCible;
  beforeEach(inject(function (_familleCible_) {
    familleCible = _familleCible_;
  }));

  it('should do something', function () {
    expect(!!familleCible).toBe(true);
  });

});
