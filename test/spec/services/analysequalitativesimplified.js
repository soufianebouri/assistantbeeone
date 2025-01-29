'use strict';

describe('Service: analyseQualitativesimplified', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var analyseQualitativesimplified;
  beforeEach(inject(function (_analyseQualitativesimplified_) {
    analyseQualitativesimplified = _analyseQualitativesimplified_;
  }));

  it('should do something', function () {
    expect(!!analyseQualitativesimplified).toBe(true);
  });

});
