'use strict';

describe('Controller: OperationsclesEclaircissagedesregimesmapCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesEclaircissagedesregimesmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesEclaircissagedesregimesmapCtrl = $controller('OperationsclesEclaircissagedesregimesmapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesEclaircissagedesregimesmapCtrl.awesomeThings.length).toBe(3);
  });
});
