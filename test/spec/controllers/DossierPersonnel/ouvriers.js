'use strict';

describe('Controller: OuvriersCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OuvriersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OuvriersCtrl = $controller('OuvriersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OuvriersCtrl.awesomeThings.length).toBe(3);
  });
});
