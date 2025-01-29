'use strict';

describe('Controller: PalmierdattierEtatdesyntheseprofilcalibreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierEtatdesyntheseprofilcalibreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierEtatdesyntheseprofilcalibreCtrl = $controller('PalmierdattierEtatdesyntheseprofilcalibreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierEtatdesyntheseprofilcalibreCtrl.awesomeThings.length).toBe(3);
  });
});
