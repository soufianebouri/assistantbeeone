'use strict';

describe('Controller: RessourceshydriquesSuiviniveaupiezometriquemapCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RessourceshydriquesSuiviniveaupiezometriquemapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RessourceshydriquesSuiviniveaupiezometriquemapCtrl = $controller('RessourceshydriquesSuiviniveaupiezometriquemapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RessourceshydriquesSuiviniveaupiezometriquemapCtrl.awesomeThings.length).toBe(3);
  });
});
