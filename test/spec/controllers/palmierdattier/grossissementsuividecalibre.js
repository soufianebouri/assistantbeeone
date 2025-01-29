'use strict';

describe('Controller: PalmierdattierGrossissementsuividecalibreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierGrossissementsuividecalibreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierGrossissementsuividecalibreCtrl = $controller('PalmierdattierGrossissementsuividecalibreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierGrossissementsuividecalibreCtrl.awesomeThings.length).toBe(3);
  });
});
