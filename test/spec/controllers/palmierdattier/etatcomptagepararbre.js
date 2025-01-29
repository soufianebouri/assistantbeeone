'use strict';

describe('Controller: PalmierdattierEtatcomptagepararbreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierEtatcomptagepararbreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierEtatcomptagepararbreCtrl = $controller('PalmierdattierEtatcomptagepararbreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierEtatcomptagepararbreCtrl.awesomeThings.length).toBe(3);
  });
});
