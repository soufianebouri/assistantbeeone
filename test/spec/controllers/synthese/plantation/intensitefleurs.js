'use strict';

describe('Controller: SynthesePlantationIntensitefleursCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SynthesePlantationIntensitefleursCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SynthesePlantationIntensitefleursCtrl = $controller('SynthesePlantationIntensitefleursCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SynthesePlantationIntensitefleursCtrl.awesomeThings.length).toBe(3);
  });
});
