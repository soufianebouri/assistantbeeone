'use strict';

describe('Controller: RecolteEtatdesyntheseagreageCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteEtatdesyntheseagreageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteEtatdesyntheseagreageCtrl = $controller('RecolteEtatdesyntheseagreageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteEtatdesyntheseagreageCtrl.awesomeThings.length).toBe(3);
  });
});
