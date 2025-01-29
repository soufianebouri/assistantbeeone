'use strict';

describe('Controller: NutritionSolutionmereCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var NutritionSolutionmereCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NutritionSolutionmereCtrl = $controller('NutritionSolutionmereCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NutritionSolutionmereCtrl.awesomeThings.length).toBe(3);
  });
});
