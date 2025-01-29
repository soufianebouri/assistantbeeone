'use strict';

describe('Controller: ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl = $controller('ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl.awesomeThings.length).toBe(3);
  });
});
