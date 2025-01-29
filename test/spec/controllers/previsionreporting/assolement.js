'use strict';

describe('Controller: PrevisionreportingAssolementCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PrevisionreportingAssolementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrevisionreportingAssolementCtrl = $controller('PrevisionreportingAssolementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PrevisionreportingAssolementCtrl.awesomeThings.length).toBe(3);
  });
});
