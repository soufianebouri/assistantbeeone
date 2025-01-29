'use strict';

describe('Service: secteurirrigation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var secteurirrigation;
  beforeEach(inject(function (_secteurirrigation_) {
    secteurirrigation = _secteurirrigation_;
  }));

  it('should do something', function () {
    expect(!!secteurirrigation).toBe(true);
  });

});
