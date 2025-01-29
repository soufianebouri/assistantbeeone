'use strict';

describe('Controller: ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl = $controller('ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl.awesomeThings.length).toBe(3);
  });
});
