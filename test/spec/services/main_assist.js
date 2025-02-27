'use strict';

describe('Service: mainAssist', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var mainAssist;
  beforeEach(inject(function (_mainAssist_) {
    mainAssist = _mainAssist_;
  }));

  it('should do something', function () {
    expect(!!mainAssist).toBe(true);
  });

});
