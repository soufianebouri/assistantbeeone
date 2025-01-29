'use strict';

describe('Controller: OperationsclesOrdredetailleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesOrdredetailleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesOrdredetailleCtrl = $controller('OperationsclesOrdredetailleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesOrdredetailleCtrl.awesomeThings.length).toBe(3);
  });
});
