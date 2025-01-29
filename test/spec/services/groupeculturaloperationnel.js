'use strict';

describe('Service: groupeculturaloperationnel', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var groupeculturaloperationnel;
  beforeEach(inject(function (_groupeculturaloperationnel_) {
    groupeculturaloperationnel = _groupeculturaloperationnel_;
  }));

  it('should do something', function () {
    expect(!!groupeculturaloperationnel).toBe(true);
  });

});
