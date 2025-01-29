'use strict';

describe('Controller: TemplatesModalqualiteStadeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalqualiteStadeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalqualiteStadeCtrl = $controller('TemplatesModalqualiteStadeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalqualiteStadeCtrl.awesomeThings.length).toBe(3);
  });
});
