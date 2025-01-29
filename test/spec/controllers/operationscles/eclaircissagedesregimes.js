'use strict';

describe('Controller: OperationsclesEclaircissagedesregimesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesEclaircissagedesregimesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesEclaircissagedesregimesCtrl = $controller('OperationsclesEclaircissagedesregimesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesEclaircissagedesregimesCtrl.awesomeThings.length).toBe(3);
  });
});
