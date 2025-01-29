'use strict';

describe('Controller: GrandesculturesSuiviqualiteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var GrandesculturesSuiviqualiteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GrandesculturesSuiviqualiteCtrl = $controller('GrandesculturesSuiviqualiteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GrandesculturesSuiviqualiteCtrl.awesomeThings.length).toBe(3);
  });
});
