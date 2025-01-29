'use strict';

describe('Controller: TemplatesAssolementAddcycleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesAssolementAddcycleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesAssolementAddcycleCtrl = $controller('TemplatesAssolementAddcycleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesAssolementAddcycleCtrl.awesomeThings.length).toBe(3);
  });
});
