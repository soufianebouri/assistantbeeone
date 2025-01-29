'use strict';

describe('Controller: TableaudebordTechniqueTabsTbTechniqueQualiteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTechniqueTabsTbTechniqueQualiteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTechniqueTabsTbTechniqueQualiteCtrl = $controller('TableaudebordTechniqueTabsTbTechniqueQualiteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTechniqueTabsTbTechniqueQualiteCtrl.awesomeThings.length).toBe(3);
  });
});
