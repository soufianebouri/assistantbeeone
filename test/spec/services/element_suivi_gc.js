'use strict';

describe('Service: elementSuiviGc', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var elementSuiviGc;
  beforeEach(inject(function (_elementSuiviGc_) {
    elementSuiviGc = _elementSuiviGc_;
  }));

  it('should do something', function () {
    expect(!!elementSuiviGc).toBe(true);
  });

});
