'use strict';

describe('Controller: TemplatesModalcarenceCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalcarenceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalcarenceCtrl = $controller('TemplatesModalcarenceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalcarenceCtrl.awesomeThings.length).toBe(3);
  });
});
