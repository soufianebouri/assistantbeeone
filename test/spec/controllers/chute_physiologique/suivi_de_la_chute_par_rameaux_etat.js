'use strict';

describe('Controller: ChutePhysiologiqueSuiviDeLaChuteParRameauxEtatCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ChutePhysiologiqueSuiviDeLaChuteParRameauxEtatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChutePhysiologiqueSuiviDeLaChuteParRameauxEtatCtrl = $controller('ChutePhysiologiqueSuiviDeLaChuteParRameauxEtatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChutePhysiologiqueSuiviDeLaChuteParRameauxEtatCtrl.awesomeThings.length).toBe(3);
  });
});
