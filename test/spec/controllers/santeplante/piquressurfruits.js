'use strict';

describe('Controller: SanteplantePiquressurfruitsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplantePiquressurfruitsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplantePiquressurfruitsCtrl = $controller('SanteplantePiquressurfruitsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplantePiquressurfruitsCtrl.awesomeThings.length).toBe(3);
  });
});
