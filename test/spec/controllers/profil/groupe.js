'use strict';

describe('Controller: ProfilGroupeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ProfilGroupeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfilGroupeCtrl = $controller('ProfilGroupeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProfilGroupeCtrl.awesomeThings.length).toBe(3);
  });
});
