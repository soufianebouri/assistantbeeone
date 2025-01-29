'use strict';

describe('Controller: PalmierdattierRecoltearbreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierRecoltearbreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierRecoltearbreCtrl = $controller('PalmierdattierRecoltearbreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierRecoltearbreCtrl.awesomeThings.length).toBe(3);
  });
});
