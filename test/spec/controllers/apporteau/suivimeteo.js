'use strict';

describe('Controller: ApporteauSuivimeteoCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ApporteauSuivimeteoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApporteauSuivimeteoCtrl = $controller('ApporteauSuivimeteoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ApporteauSuivimeteoCtrl.awesomeThings.length).toBe(3);
  });
});
