'use strict';

describe('Service: changementpheromone', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var changementpheromone;
  beforeEach(inject(function (_changementpheromone_) {
    changementpheromone = _changementpheromone_;
  }));

  it('should do something', function () {
    expect(!!changementpheromone).toBe(true);
  });

});
