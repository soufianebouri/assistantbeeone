'use strict';

describe('Controller: ProfilGestionprofilsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ProfilGestionprofilsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfilGestionprofilsCtrl = $controller('ProfilGestionprofilsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProfilGestionprofilsCtrl.awesomeThings.length).toBe(3);
  });
});
