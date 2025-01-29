'use strict';

describe('Controller: RessourceshydriquesSuiviressourceshydriquesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RessourceshydriquesSuiviressourceshydriquesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RessourceshydriquesSuiviressourceshydriquesCtrl = $controller('RessourceshydriquesSuiviressourceshydriquesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RessourceshydriquesSuiviressourceshydriquesCtrl.awesomeThings.length).toBe(3);
  });
});
