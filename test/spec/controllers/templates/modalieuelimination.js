'use strict';

describe('Controller: TemplatesModalieueliminationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalieueliminationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalieueliminationCtrl = $controller('TemplatesModalieueliminationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalieueliminationCtrl.awesomeThings.length).toBe(3);
  });
});
