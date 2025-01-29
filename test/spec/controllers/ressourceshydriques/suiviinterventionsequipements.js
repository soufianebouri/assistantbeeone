'use strict';

describe('Controller: RessourceshydriquesSuiviinterventionsequipementsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RessourceshydriquesSuiviinterventionsequipementsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RessourceshydriquesSuiviinterventionsequipementsCtrl = $controller('RessourceshydriquesSuiviinterventionsequipementsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RessourceshydriquesSuiviinterventionsequipementsCtrl.awesomeThings.length).toBe(3);
  });
});
