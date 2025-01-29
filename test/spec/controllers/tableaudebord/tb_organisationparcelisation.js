'use strict';

describe('Controller: TableaudebordTbOrganisationparcelisationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTbOrganisationparcelisationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTbOrganisationparcelisationCtrl = $controller('TableaudebordTbOrganisationparcelisationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTbOrganisationparcelisationCtrl.awesomeThings.length).toBe(3);
  });
});
