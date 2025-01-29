'use strict';

describe('Controller: SynthesePlantationPourcentageouvertureCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SynthesePlantationPourcentageouvertureCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SynthesePlantationPourcentageouvertureCtrl = $controller('SynthesePlantationPourcentageouvertureCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SynthesePlantationPourcentageouvertureCtrl.awesomeThings.length).toBe(3);
  });
});
