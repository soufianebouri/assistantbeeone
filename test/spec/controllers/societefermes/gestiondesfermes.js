'use strict';

describe('Controller: SocietefermesGestiondesfermesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SocietefermesGestiondesfermesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SocietefermesGestiondesfermesCtrl = $controller('SocietefermesGestiondesfermesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SocietefermesGestiondesfermesCtrl.awesomeThings.length).toBe(3);
  });
});
