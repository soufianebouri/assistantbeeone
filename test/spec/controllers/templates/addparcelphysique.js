'use strict';

describe('Controller: TemplatesAddparcelphysiqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesAddparcelphysiqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesAddparcelphysiqueCtrl = $controller('TemplatesAddparcelphysiqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesAddparcelphysiqueCtrl.awesomeThings.length).toBe(3);
  });
});
