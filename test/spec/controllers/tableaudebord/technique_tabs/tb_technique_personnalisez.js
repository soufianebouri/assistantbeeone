'use strict';

describe('Controller: TableaudebordTechniqueTabsTbTechniquePersonnalisezCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTechniqueTabsTbTechniquePersonnalisezCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTechniqueTabsTbTechniquePersonnalisezCtrl = $controller('TableaudebordTechniqueTabsTbTechniquePersonnalisezCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTechniqueTabsTbTechniquePersonnalisezCtrl.awesomeThings.length).toBe(3);
  });
});
