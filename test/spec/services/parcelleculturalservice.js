'use strict';

describe('Service: parcelleCulturalService', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var parcelleCulturalService;
  beforeEach(inject(function (_parcelleCulturalService_) {
    parcelleCulturalService = _parcelleCulturalService_;
  }));

  it('should do something', function () {
    expect(!!parcelleCulturalService).toBe(true);
  });

});
