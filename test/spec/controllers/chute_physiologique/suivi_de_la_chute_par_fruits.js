'use strict';

describe('Controller: ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl = $controller('ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl.awesomeThings.length).toBe(3);
  });
});
