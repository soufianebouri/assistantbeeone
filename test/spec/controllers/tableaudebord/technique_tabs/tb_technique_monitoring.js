'use strict';

describe('Controller: TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl = $controller('TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl.awesomeThings.length).toBe(3);
  });
});
