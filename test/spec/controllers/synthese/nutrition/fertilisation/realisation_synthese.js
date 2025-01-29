'use strict';

describe('Controller: SyntheseNutritionFertilisationRealisationSyntheseCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SyntheseNutritionFertilisationRealisationSyntheseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SyntheseNutritionFertilisationRealisationSyntheseCtrl = $controller('SyntheseNutritionFertilisationRealisationSyntheseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SyntheseNutritionFertilisationRealisationSyntheseCtrl.awesomeThings.length).toBe(3);
  });
});
