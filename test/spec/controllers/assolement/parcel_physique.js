'use strict';

describe('Controller: AssolementParcelPhysiqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var AssolementParcelPhysiqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssolementParcelPhysiqueCtrl = $controller('AssolementParcelPhysiqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssolementParcelPhysiqueCtrl.awesomeThings.length).toBe(3);
  });
});
