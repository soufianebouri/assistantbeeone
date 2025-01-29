'use strict';

describe('Controller: RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl = $controller('RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl.awesomeThings.length).toBe(3);
  });
});
