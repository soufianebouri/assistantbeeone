'use strict';

describe('Controller: NutritionRealisationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var NutritionRealisationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NutritionRealisationCtrl = $controller('NutritionRealisationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NutritionRealisationCtrl.awesomeThings.length).toBe(3);
  });
});
