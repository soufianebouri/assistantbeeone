'use strict';

describe('Controller: SyntheseApporteauSyntheseApportEauApportseneauCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SyntheseApporteauSyntheseApportEauApportseneauCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SyntheseApporteauSyntheseApportEauApportseneauCtrl = $controller('SyntheseApporteauSyntheseApportEauApportseneauCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SyntheseApporteauSyntheseApportEauApportseneauCtrl.awesomeThings.length).toBe(3);
  });
});
