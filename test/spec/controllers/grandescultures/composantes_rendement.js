'use strict';

describe('Controller: GrandesculturesComposantesRendementCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var GrandesculturesComposantesRendementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GrandesculturesComposantesRendementCtrl = $controller('GrandesculturesComposantesRendementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GrandesculturesComposantesRendementCtrl.awesomeThings.length).toBe(3);
  });
});
