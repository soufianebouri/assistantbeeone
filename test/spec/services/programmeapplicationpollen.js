'use strict';

describe('Service: programmeapplicationpollen', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var programmeapplicationpollen;
  beforeEach(inject(function (_programmeapplicationpollen_) {
    programmeapplicationpollen = _programmeapplicationpollen_;
  }));

  it('should do something', function () {
    expect(!!programmeapplicationpollen).toBe(true);
  });

});
