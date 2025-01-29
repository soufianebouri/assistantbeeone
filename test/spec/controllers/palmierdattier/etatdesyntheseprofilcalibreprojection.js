'use strict';

describe('Controller: PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl = $controller('PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl.awesomeThings.length).toBe(3);
  });
});
