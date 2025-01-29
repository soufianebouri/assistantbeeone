'use strict';

describe('Controller: OperationsclesExtractiondepollenCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesExtractiondepollenCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesExtractiondepollenCtrl = $controller('OperationsclesExtractiondepollenCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesExtractiondepollenCtrl.awesomeThings.length).toBe(3);
  });
});
