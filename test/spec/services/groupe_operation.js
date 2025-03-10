'use strict';

describe('Service: groupeOperation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var groupeOperation;
  beforeEach(inject(function (_groupeOperation_) {
    groupeOperation = _groupeOperation_;
  }));

  it('should do something', function () {
    expect(!!groupeOperation).toBe(true);
  });

});
