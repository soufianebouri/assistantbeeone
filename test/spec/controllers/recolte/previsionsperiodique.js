'use strict';

describe('Controller: RecoltePrevisionsperiodiqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecoltePrevisionsperiodiqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecoltePrevisionsperiodiqueCtrl = $controller('RecoltePrevisionsperiodiqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecoltePrevisionsperiodiqueCtrl.awesomeThings.length).toBe(3);
  });
});
