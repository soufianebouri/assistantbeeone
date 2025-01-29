'use strict';

describe('Service: qualiteStade', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var qualiteStade;
  beforeEach(inject(function (_qualiteStade_) {
    qualiteStade = _qualiteStade_;
  }));

  it('should do something', function () {
    expect(!!qualiteStade).toBe(true);
  });

});
