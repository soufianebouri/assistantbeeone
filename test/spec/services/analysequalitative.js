'use strict';

describe('Service: analyseQualitative', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var analyseQualitative;
  beforeEach(inject(function (_analyseQualitative_) {
    analyseQualitative = _analyseQualitative_;
  }));

  it('should do something', function () {
    expect(!!analyseQualitative).toBe(true);
  });

});
