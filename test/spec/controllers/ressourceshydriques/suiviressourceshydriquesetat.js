'use strict';

describe('Controller: RessourceshydriquesSuiviressourceshydriquesetatCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RessourceshydriquesSuiviressourceshydriquesetatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RessourceshydriquesSuiviressourceshydriquesetatCtrl = $controller('RessourceshydriquesSuiviressourceshydriquesetatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RessourceshydriquesSuiviressourceshydriquesetatCtrl.awesomeThings.length).toBe(3);
  });
});
