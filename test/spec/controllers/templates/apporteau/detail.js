'use strict';

describe('Controller: TemplatesApporteauDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesApporteauDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesApporteauDetailCtrl = $controller('TemplatesApporteauDetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesApporteauDetailCtrl.awesomeThings.length).toBe(3);
  });
});
