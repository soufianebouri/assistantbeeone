'use strict';

describe('Service: IntensiteStadeService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var IntensiteStadeService;
  beforeEach(inject(function (_IntensiteStadeService_) {
    IntensiteStadeService = _IntensiteStadeService_;
  }));

  it('should do something', function () {
    expect(!!IntensiteStadeService).toBe(true);
  });

});
