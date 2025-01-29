'use strict';

describe('Controller: PalmierdattierComptagearbremapCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierComptagearbremapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierComptagearbremapCtrl = $controller('PalmierdattierComptagearbremapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierComptagearbremapCtrl.awesomeThings.length).toBe(3);
  });
});
