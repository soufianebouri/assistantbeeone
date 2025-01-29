'use strict';

describe('Controller: PalmierdattierFichedesuiviprofilcalibreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierFichedesuiviprofilcalibreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierFichedesuiviprofilcalibreCtrl = $controller('PalmierdattierFichedesuiviprofilcalibreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierFichedesuiviprofilcalibreCtrl.awesomeThings.length).toBe(3);
  });
});
