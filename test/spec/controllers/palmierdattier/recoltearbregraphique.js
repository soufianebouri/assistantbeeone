'use strict';

describe('Controller: PalmierdattierRecoltearbregraphiqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierRecoltearbregraphiqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierRecoltearbregraphiqueCtrl = $controller('PalmierdattierRecoltearbregraphiqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierRecoltearbregraphiqueCtrl.awesomeThings.length).toBe(3);
  });
});
