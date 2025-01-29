'use strict';

describe('Service: BilanNutritionnel', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var BilanNutritionnel;
  beforeEach(inject(function (_BilanNutritionnel_) {
    BilanNutritionnel = _BilanNutritionnel_;
  }));

  it('should do something', function () {
    expect(!!BilanNutritionnel).toBe(true);
  });

});
