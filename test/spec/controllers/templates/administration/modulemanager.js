'use strict';

describe('Controller: TemplatesAdministrationModulemanagerCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesAdministrationModulemanagerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesAdministrationModulemanagerCtrl = $controller('TemplatesAdministrationModulemanagerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesAdministrationModulemanagerCtrl.awesomeThings.length).toBe(3);
  });
});
