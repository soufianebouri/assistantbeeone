'use strict';

describe('Controller: OperationsclesOperationdesemisCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesOperationdesemisCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesOperationdesemisCtrl = $controller('OperationsclesOperationdesemisCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesOperationdesemisCtrl.awesomeThings.length).toBe(3);
  });
});
