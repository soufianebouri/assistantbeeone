'use strict';

describe('Controller: SyntheseApporteauRealisationirrigationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SyntheseApporteauRealisationirrigationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SyntheseApporteauRealisationirrigationCtrl = $controller('SyntheseApporteauRealisationirrigationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SyntheseApporteauRealisationirrigationCtrl.awesomeThings.length).toBe(3);
  });
});
