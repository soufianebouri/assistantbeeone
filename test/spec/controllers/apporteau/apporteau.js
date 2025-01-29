'use strict';

describe('Controller: ApporteauApporteauCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ApporteauApporteauCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApporteauApporteauCtrl = $controller('ApporteauApporteauCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ApporteauApporteauCtrl.awesomeThings.length).toBe(3);
  });
});
