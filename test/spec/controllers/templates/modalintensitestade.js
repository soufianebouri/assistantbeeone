'use strict';

describe('Controller: TemplatesModalintensitestadeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalintensitestadeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalintensitestadeCtrl = $controller('TemplatesModalintensitestadeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalintensitestadeCtrl.awesomeThings.length).toBe(3);
  });
});
