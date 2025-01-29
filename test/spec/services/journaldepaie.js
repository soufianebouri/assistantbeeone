'use strict';

describe('Service: journaldepaie', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var journaldepaie;
  beforeEach(inject(function (_journaldepaie_) {
    journaldepaie = _journaldepaie_;
  }));

  it('should do something', function () {
    expect(!!journaldepaie).toBe(true);
  });

});
