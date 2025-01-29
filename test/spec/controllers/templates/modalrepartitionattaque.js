'use strict';

describe('Controller: TemplatesModalrepartitionattaqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalrepartitionattaqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalrepartitionattaqueCtrl = $controller('TemplatesModalrepartitionattaqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalrepartitionattaqueCtrl.awesomeThings.length).toBe(3);
  });
});
