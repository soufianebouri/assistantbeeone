'use strict';

describe('Controller: OperationsclesEclaircissagedesregimesordreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesEclaircissagedesregimesordreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesEclaircissagedesregimesordreCtrl = $controller('OperationsclesEclaircissagedesregimesordreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesEclaircissagedesregimesordreCtrl.awesomeThings.length).toBe(3);
  });
});
