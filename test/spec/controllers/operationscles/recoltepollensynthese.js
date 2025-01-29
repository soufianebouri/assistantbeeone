'use strict';

describe('Controller: OperationsclesRecoltepollensyntheseCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesRecoltepollensyntheseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesRecoltepollensyntheseCtrl = $controller('OperationsclesRecoltepollensyntheseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesRecoltepollensyntheseCtrl.awesomeThings.length).toBe(3);
  });
});
