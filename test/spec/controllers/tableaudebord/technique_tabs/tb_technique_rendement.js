'use strict';

describe('Controller: TableaudebordTechniqueTabsTbTechniqueRendementCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTechniqueTabsTbTechniqueRendementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTechniqueTabsTbTechniqueRendementCtrl = $controller('TableaudebordTechniqueTabsTbTechniqueRendementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTechniqueTabsTbTechniqueRendementCtrl.awesomeThings.length).toBe(3);
  });
});
