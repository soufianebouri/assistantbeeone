'use strict';

describe('Service: typeirrigation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var typeirrigation;
  beforeEach(inject(function (_typeirrigation_) {
    typeirrigation = _typeirrigation_;
  }));

  it('should do something', function () {
    expect(!!typeirrigation).toBe(true);
  });

});
