'use strict';

describe('Controller: TemplatesModalelementsminerauxCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalelementsminerauxCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalelementsminerauxCtrl = $controller('TemplatesModalelementsminerauxCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalelementsminerauxCtrl.awesomeThings.length).toBe(3);
  });
});
