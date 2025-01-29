'use strict';

describe('Controller: RendementVenteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RendementVenteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RendementVenteCtrl = $controller('RendementVenteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RendementVenteCtrl.awesomeThings.length).toBe(3);
  });
});
