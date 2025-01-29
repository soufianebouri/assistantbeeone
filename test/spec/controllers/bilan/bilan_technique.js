'use strict';

describe('Controller: BilanBilanTechniqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var BilanBilanTechniqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BilanBilanTechniqueCtrl = $controller('BilanBilanTechniqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BilanBilanTechniqueCtrl.awesomeThings.length).toBe(3);
  });
});
