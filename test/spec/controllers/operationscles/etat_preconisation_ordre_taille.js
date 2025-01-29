'use strict';

describe('Controller: OperationsclesEtatPreconisationOrdreTailleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesEtatPreconisationOrdreTailleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesEtatPreconisationOrdreTailleCtrl = $controller('OperationsclesEtatPreconisationOrdreTailleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesEtatPreconisationOrdreTailleCtrl.awesomeThings.length).toBe(3);
  });
});
