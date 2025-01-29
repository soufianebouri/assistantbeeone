'use strict';

describe('Service: analysequalitativefeuilles', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var analysequalitativefeuilles;
  beforeEach(inject(function (_analysequalitativefeuilles_) {
    analysequalitativefeuilles = _analysequalitativefeuilles_;
  }));

  it('should do something', function () {
    expect(!!analysequalitativefeuilles).toBe(true);
  });

});
