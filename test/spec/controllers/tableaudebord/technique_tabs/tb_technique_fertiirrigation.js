'use strict';

describe('Controller: TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl = $controller('TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl.awesomeThings.length).toBe(3);
  });
});
