'use strict';

describe('Controller: PalmierdattierRecoltearbremapCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierRecoltearbremapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierRecoltearbremapCtrl = $controller('PalmierdattierRecoltearbremapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierRecoltearbremapCtrl.awesomeThings.length).toBe(3);
  });
});
