'use strict';

describe('Service: estimationsparparcelle', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var estimationsparparcelle;
  beforeEach(inject(function (_estimationsparparcelle_) {
    estimationsparparcelle = _estimationsparparcelle_;
  }));

  it('should do something', function () {
    expect(!!estimationsparparcelle).toBe(true);
  });

});
