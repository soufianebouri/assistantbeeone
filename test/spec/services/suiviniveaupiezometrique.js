'use strict';

describe('Service: suiviniveaupiezometrique', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var suiviniveaupiezometrique;
  beforeEach(inject(function (_suiviniveaupiezometrique_) {
    suiviniveaupiezometrique = _suiviniveaupiezometrique_;
  }));

  it('should do something', function () {
    expect(!!suiviniveaupiezometrique).toBe(true);
  });

});
