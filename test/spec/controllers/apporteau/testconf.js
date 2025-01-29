'use strict';

describe('Controller: ApporteauTestconfCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ApporteauTestconfCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApporteauTestconfCtrl = $controller('ApporteauTestconfCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ApporteauTestconfCtrl.awesomeThings.length).toBe(3);
  });
});
