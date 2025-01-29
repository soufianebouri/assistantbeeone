'use strict';

describe('Controller: SanteplanteFichesdesuividetraitementsphytosanitaireCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteFichesdesuividetraitementsphytosanitaireCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteFichesdesuividetraitementsphytosanitaireCtrl = $controller('SanteplanteFichesdesuividetraitementsphytosanitaireCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteFichesdesuividetraitementsphytosanitaireCtrl.awesomeThings.length).toBe(3);
  });
});
