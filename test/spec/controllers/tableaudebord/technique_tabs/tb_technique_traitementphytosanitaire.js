'use strict';

describe('Controller: TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl = $controller('TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl.awesomeThings.length).toBe(3);
  });
});
