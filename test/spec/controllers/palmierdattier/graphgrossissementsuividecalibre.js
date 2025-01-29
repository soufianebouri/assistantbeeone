'use strict';

describe('Controller: PalmierdattierGraphgrossissementsuividecalibreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierGraphgrossissementsuividecalibreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierGraphgrossissementsuividecalibreCtrl = $controller('PalmierdattierGraphgrossissementsuividecalibreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierGraphgrossissementsuividecalibreCtrl.awesomeThings.length).toBe(3);
  });
});
