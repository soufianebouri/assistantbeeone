'use strict';

describe('Controller: PalmierdattierEtatNombreArbreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierEtatNombreArbreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierEtatNombreArbreCtrl = $controller('PalmierdattierEtatNombreArbreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierEtatNombreArbreCtrl.awesomeThings.length).toBe(3);
  });
});
