'use strict';

describe('Controller: NutritionControlephecCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var NutritionControlephecCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NutritionControlephecCtrl = $controller('NutritionControlephecCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NutritionControlephecCtrl.awesomeThings.length).toBe(3);
  });
});
