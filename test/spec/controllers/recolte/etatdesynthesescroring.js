'use strict';

describe('Controller: RecolteEtatdesynthesescroringCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteEtatdesynthesescroringCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteEtatdesynthesescroringCtrl = $controller('RecolteEtatdesynthesescroringCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteEtatdesynthesescroringCtrl.awesomeThings.length).toBe(3);
  });
});
