'use strict';

describe('Controller: PalmierdattierProfilcalibreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierProfilcalibreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierProfilcalibreCtrl = $controller('PalmierdattierProfilcalibreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierProfilcalibreCtrl.awesomeThings.length).toBe(3);
  });
});
