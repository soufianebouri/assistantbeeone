'use strict';

describe('Controller: TemplatesGestionregionCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesGestionregionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesGestionregionCtrl = $controller('TemplatesGestionregionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesGestionregionCtrl.awesomeThings.length).toBe(3);
  });
});
