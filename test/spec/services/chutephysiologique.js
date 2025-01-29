'use strict';

describe('Service: ChutePhysiologique', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ChutePhysiologique;
  beforeEach(inject(function (_ChutePhysiologique_) {
    ChutePhysiologique = _ChutePhysiologique_;
  }));

  it('should do something', function () {
    expect(!!ChutePhysiologique).toBe(true);
  });

});
