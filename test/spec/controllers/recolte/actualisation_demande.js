'use strict';

describe('Controller: RecolteActualisationDemandeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteActualisationDemandeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteActualisationDemandeCtrl = $controller('RecolteActualisationDemandeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteActualisationDemandeCtrl.awesomeThings.length).toBe(3);
  });
});
