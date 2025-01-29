'use strict';

describe('Controller: AssolementParcelCulturaleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var AssolementParcelCulturaleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssolementParcelCulturaleCtrl = $controller('AssolementParcelCulturaleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssolementParcelCulturaleCtrl.awesomeThings.length).toBe(3);
  });
});
