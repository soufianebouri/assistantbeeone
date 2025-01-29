'use strict';

describe('Controller: RessourceshydriquesSuiviniveaupiezometriqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RessourceshydriquesSuiviniveaupiezometriqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RessourceshydriquesSuiviniveaupiezometriqueCtrl = $controller('RessourceshydriquesSuiviniveaupiezometriqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RessourceshydriquesSuiviniveaupiezometriqueCtrl.awesomeThings.length).toBe(3);
  });
});
