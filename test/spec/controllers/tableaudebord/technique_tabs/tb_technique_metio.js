'use strict';

describe('Controller: TableaudebordTechniqueTabsTbTechniqueMetioCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTechniqueTabsTbTechniqueMetioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTechniqueTabsTbTechniqueMetioCtrl = $controller('TableaudebordTechniqueTabsTbTechniqueMetioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTechniqueTabsTbTechniqueMetioCtrl.awesomeThings.length).toBe(3);
  });
});
