'use strict';

describe('Controller: MainoeuvreetatsLesabsencesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var MainoeuvreetatsLesabsencesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainoeuvreetatsLesabsencesCtrl = $controller('MainoeuvreetatsLesabsencesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainoeuvreetatsLesabsencesCtrl.awesomeThings.length).toBe(3);
  });
});
