'use strict';

describe('Controller: OperationsclesRecoltepollenCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesRecoltepollenCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesRecoltepollenCtrl = $controller('OperationsclesRecoltepollenCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesRecoltepollenCtrl.awesomeThings.length).toBe(3);
  });
});
