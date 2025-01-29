'use strict';

describe('Controller: PalmierdattierEstimationsparparcelleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierEstimationsparparcelleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierEstimationsparparcelleCtrl = $controller('PalmierdattierEstimationsparparcelleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierEstimationsparparcelleCtrl.awesomeThings.length).toBe(3);
  });
});
