'use strict';

describe('Controller: TemplatesModalcolorationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalcolorationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalcolorationCtrl = $controller('TemplatesModalcolorationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalcolorationCtrl.awesomeThings.length).toBe(3);
  });
});
