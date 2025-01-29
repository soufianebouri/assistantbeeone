'use strict';

describe('Controller: TemplatesAssolementAddparcelcuturalCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesAssolementAddparcelcuturalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesAssolementAddparcelcuturalCtrl = $controller('TemplatesAssolementAddparcelcuturalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesAssolementAddparcelcuturalCtrl.awesomeThings.length).toBe(3);
  });
});
