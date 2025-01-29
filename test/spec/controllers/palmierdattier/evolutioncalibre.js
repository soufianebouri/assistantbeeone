'use strict';

describe('Controller: PalmierdattierEvolutioncalibreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierEvolutioncalibreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierEvolutioncalibreCtrl = $controller('PalmierdattierEvolutioncalibreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierEvolutioncalibreCtrl.awesomeThings.length).toBe(3);
  });
});
