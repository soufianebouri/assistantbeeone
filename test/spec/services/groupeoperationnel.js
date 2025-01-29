'use strict';

describe('Service: GroupeOperationnel', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var GroupeOperationnel;
  beforeEach(inject(function (_GroupeOperationnel_) {
    GroupeOperationnel = _GroupeOperationnel_;
  }));

  it('should do something', function () {
    expect(!!GroupeOperationnel).toBe(true);
  });

});
