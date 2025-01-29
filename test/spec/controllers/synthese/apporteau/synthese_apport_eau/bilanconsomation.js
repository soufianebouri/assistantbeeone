'use strict';

describe('Controller: SyntheseApporteauSyntheseApportEauBilanconsomationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SyntheseApporteauSyntheseApportEauBilanconsomationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SyntheseApporteauSyntheseApportEauBilanconsomationCtrl = $controller('SyntheseApporteauSyntheseApportEauBilanconsomationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SyntheseApporteauSyntheseApportEauBilanconsomationCtrl.awesomeThings.length).toBe(3);
  });
});
