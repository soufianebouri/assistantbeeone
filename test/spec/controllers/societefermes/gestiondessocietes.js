'use strict';

describe('Controller: SocietefermesGestiondessocietesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SocietefermesGestiondessocietesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SocietefermesGestiondessocietesCtrl = $controller('SocietefermesGestiondessocietesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SocietefermesGestiondessocietesCtrl.awesomeThings.length).toBe(3);
  });
});
