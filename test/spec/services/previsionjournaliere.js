'use strict';

describe('Service: PrevisionJournaliere', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var PrevisionJournaliere;
  beforeEach(inject(function (_PrevisionJournaliere_) {
    PrevisionJournaliere = _PrevisionJournaliere_;
  }));

  it('should do something', function () {
    expect(!!PrevisionJournaliere).toBe(true);
  });

});
