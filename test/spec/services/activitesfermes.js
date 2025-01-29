'use strict';

describe('Service: activitesfermes', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var activitesfermes;
  beforeEach(inject(function (_activitesfermes_) {
    activitesfermes = _activitesfermes_;
  }));

  it('should do something', function () {
    expect(!!activitesfermes).toBe(true);
  });

});
