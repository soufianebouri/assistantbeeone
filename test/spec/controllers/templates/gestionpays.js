'use strict';

describe('Controller: TemplatesGestionpaysCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesGestionpaysCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesGestionpaysCtrl = $controller('TemplatesGestionpaysCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesGestionpaysCtrl.awesomeThings.length).toBe(3);
  });
});
