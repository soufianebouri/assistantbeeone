'use strict';

describe('Controller: OperationsclesProgrammeapplicationpollenCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesProgrammeapplicationpollenCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesProgrammeapplicationpollenCtrl = $controller('OperationsclesProgrammeapplicationpollenCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesProgrammeapplicationpollenCtrl.awesomeThings.length).toBe(3);
  });
});
